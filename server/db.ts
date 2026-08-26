import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, accounts, auditLogs, brands, categories, customers, dailyClosings, dueReminders, expenses, ledgerEntries, payments, products, purchaseItems, purchases, reminderSettings, saleItems, sales, shopSettings, stockTransactions, suppliers, users } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { buildDailySalesSeries, normalizeInventoryStatus } from "./dashboardAnalytics";
import { calculateDailyClosingTotals } from "./closingMath";
import { buildCustomerDueAging, type CustomerDueAgingRow } from "./dueAging";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "owner"; updateSet.role = "owner"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listProducts(search?: string) {
  const db = await getDb(); if (!db) return [];
  const where = search ? or(like(products.name, `%${search}%`), like(products.sku, `%${search}%`), like(products.partNumber, `%${search}%`)) : undefined;
  return db.select().from(products).where(where).orderBy(desc(products.createdAt));
}
export async function listCustomers(search?: string) {
  const db = await getDb(); if (!db) return [];
  const where = search ? or(like(customers.name, `%${search}%`), like(customers.phone, `%${search}%`)) : undefined;
  return db.select().from(customers).where(where).orderBy(desc(customers.createdAt));
}
export async function listSuppliers(search?: string) {
  const db = await getDb(); if (!db) return [];
  const where = search ? or(like(suppliers.name, `%${search}%`), like(suppliers.phone, `%${search}%`)) : undefined;
  return db.select().from(suppliers).where(where).orderBy(desc(suppliers.createdAt));
}
export async function listAccounts() { const db = await getDb(); return db ? db.select().from(accounts).orderBy(accounts.name) : []; }

export async function writeAudit(userId: number, action: string, entity: string, entityId?: number, details?: string) {
  const db = await getDb(); if (!db) return;
  await db.insert(auditLogs).values({ userId, action, entity, entityId, details });
}

export async function getDashboardAnalytics(days = 7) {
  const db = await getDb();
  const empty = { dailySales: [] as { date: string; sales: number; collections: number }[], inventoryStatus: { healthy: 0, lowStock: 0, outOfStock: 0 } };
  if (!db) return empty;
  const count = days === 30 ? 30 : 7;
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (count - 1));
  const dailyRows = await db.select({ date: sql<string>`DATE_FORMAT(${sales.createdAt}, '%Y-%m-%d')`, sales: sql<string>`COALESCE(SUM(${sales.total}),0)`, collections: sql<string>`COALESCE(SUM(${sales.paid}),0)` }).from(sales).where(gte(sales.createdAt, start)).groupBy(sql`1`);
  const dailySales = buildDailySalesSeries(dailyRows, new Date(), count);
  const [inventory] = await db.select({ healthy: sql<number>`COALESCE(SUM(CASE WHEN ${products.stockQty} > ${products.minStock} THEN 1 ELSE 0 END),0)`, lowStock: sql<number>`COALESCE(SUM(CASE WHEN ${products.stockQty} > 0 AND ${products.stockQty} <= ${products.minStock} THEN 1 ELSE 0 END),0)`, outOfStock: sql<number>`COALESCE(SUM(CASE WHEN ${products.stockQty} <= 0 THEN 1 ELSE 0 END),0)` }).from(products);
  return { dailySales, inventoryStatus: normalizeInventoryStatus(inventory ?? {}) };
}

export async function getDailyClosing(date?: string) {
  const db = await getDb();
  const empty = { date: date || new Date().toISOString().slice(0, 10), grossSales: 0, refunds: 0, netSales: 0, collections: 0, purchasesPaid: 0, expenses: 0, totalOut: 0, expectedNet: 0, salesCount: 0, refundCount: 0, expenseCount: 0, channels: [] as { method: string; amount: number }[], variance: 0 };
  if (!db) return empty;
  const day = date || new Date().toISOString().slice(0, 10);
  const start = new Date(`${day}T00:00:00`); const end = new Date(`${day}T23:59:59.999`);
  const salesRows = await db.select().from(sales).where(and(gte(sales.createdAt, start), lte(sales.createdAt, end)));
  const paymentRows = await db.select({ payment: payments, accountType: accounts.type }).from(payments).leftJoin(accounts, eq(payments.accountId, accounts.id)).where(and(gte(payments.createdAt, start), lte(payments.createdAt, end)));
  const expenseRows = await db.select().from(expenses).where(and(gte(expenses.createdAt, start), lte(expenses.createdAt, end)));
  const totals = calculateDailyClosingTotals({ sales: salesRows, payments: paymentRows.map(row => ({ ...row.payment, accountType: row.accountType })), expenses: expenseRows });
  return { date: day, ...totals };
}

export async function saveDailyClosing(input: { date: string; grossSales: number; refunds: number; netSales: number; collections: number; totalOut: number; expectedNet: number; countedCash: number; variance: number; notes?: string }, userId: number) {
  const db = await getDb(); if (!db) return undefined;
  await db.insert(dailyClosings).values({ businessDate: input.date, grossSales: input.grossSales.toFixed(2), refunds: input.refunds.toFixed(2), netSales: input.netSales.toFixed(2), collections: input.collections.toFixed(2), totalOut: input.totalOut.toFixed(2), expectedNet: input.expectedNet.toFixed(2), countedCash: input.countedCash.toFixed(2), variance: input.variance.toFixed(2), notes: input.notes?.trim() || null, closedBy: userId }).onDuplicateKeyUpdate({ set: { grossSales: input.grossSales.toFixed(2), refunds: input.refunds.toFixed(2), netSales: input.netSales.toFixed(2), collections: input.collections.toFixed(2), totalOut: input.totalOut.toFixed(2), expectedNet: input.expectedNet.toFixed(2), countedCash: input.countedCash.toFixed(2), variance: input.variance.toFixed(2), notes: input.notes?.trim() || null, closedBy: userId, closedAt: new Date() } });
  const [row] = await db.select().from(dailyClosings).where(eq(dailyClosings.businessDate, input.date)).limit(1); return row;
}

export async function listDailyClosings(limit = 30) { const db = await getDb(); return db ? db.select().from(dailyClosings).orderBy(desc(dailyClosings.businessDate)).limit(limit) : []; }

export async function getCustomerDueAging() {
  const db = await getDb();
  if (!db) return [] as CustomerDueAgingRow[];
  const rows = await db.select({ partyId: ledgerEntries.partyId, due: sql<string>`COALESCE(SUM(${ledgerEntries.debit} - ${ledgerEntries.credit}), 0)`, oldestAt: sql<string>`MIN(${ledgerEntries.createdAt})`, references: sql<string>`COALESCE(GROUP_CONCAT(DISTINCT CONCAT(${ledgerEntries.referenceType}, IF(${ledgerEntries.referenceId} IS NULL, '', CONCAT('#', ${ledgerEntries.referenceId}))) ORDER BY ${ledgerEntries.createdAt} DESC SEPARATOR ', '), '')` }).from(ledgerEntries).where(eq(ledgerEntries.partyType, "customer")).groupBy(ledgerEntries.partyId);
  return buildCustomerDueAging(rows.map(row => ({ ...row, references: row.references ? row.references.split(", ").filter(Boolean) : [] })));
}

export async function getDashboardSummary() {
  const db = await getDb();
  if (!db) return { sales: "0", collections: "0", purchases: "0", customerDue: "0", supplierPayable: "0", stockValue: "0", grossProfit: "0", cashBalance: "0", topProducts: [], lowStock: [] };
  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0); const dayEnd = new Date(); dayEnd.setHours(23, 59, 59, 999); const [saleTotals] = await db.select({ total: sql<string>`COALESCE(SUM(${sales.total}),0)`, paid: sql<string>`COALESCE(SUM(${sales.paid}),0)` }).from(sales).where(and(gte(sales.createdAt, dayStart), lte(sales.createdAt, dayEnd))); const [profitTotals] = await db.select({ profit: sql<string>`COALESCE(SUM((${saleItems.unitPrice} - ${saleItems.unitCost}) * ${saleItems.quantity}),0)` }).from(saleItems).innerJoin(sales, eq(saleItems.saleId, sales.id)).where(and(gte(sales.createdAt, dayStart), lte(sales.createdAt, dayEnd)));
  const [purchaseTotals] = await db.select({ total: sql<string>`COALESCE(SUM(${purchases.total}),0)` }).from(purchases);
  const [stockTotals] = await db.select({ value: sql<string>`COALESCE(SUM(${products.stockQty} * ${products.purchasePrice}),0)` }).from(products);
  const [cash] = await db.select({ balance: sql<string>`COALESCE(SUM(${accounts.balance}),0)` }).from(accounts).where(eq(accounts.type, "cash"));
  const lowStock = await db.select({ id: products.id, name: products.name, sku: products.sku, stockQty: products.stockQty, minStock: products.minStock }).from(products).where(sql`${products.stockQty} <= ${products.minStock}`).orderBy(products.stockQty).limit(6);
  const topProducts = await db.select({ productId: saleItems.productId, quantity: sql<number>`SUM(${saleItems.quantity})`, revenue: sql<string>`SUM(${saleItems.lineTotal})` }).from(saleItems).groupBy(saleItems.productId).orderBy(desc(sql`SUM(${saleItems.quantity})`)).limit(5);
  const [customerDue] = await db.select({ due: sql<string>`COALESCE(SUM(${ledgerEntries.debit} - ${ledgerEntries.credit}),0)` }).from(ledgerEntries).where(eq(ledgerEntries.partyType, "customer"));
  const [supplierPayable] = await db.select({ due: sql<string>`COALESCE(SUM(${ledgerEntries.credit} - ${ledgerEntries.debit}),0)` }).from(ledgerEntries).where(eq(ledgerEntries.partyType, "supplier"));
  return { sales: saleTotals?.total ?? "0", collections: saleTotals?.paid ?? "0", purchases: purchaseTotals?.total ?? "0", customerDue: customerDue?.due ?? "0", supplierPayable: supplierPayable?.due ?? "0", stockValue: stockTotals?.value ?? "0", grossProfit: profitTotals?.profit ?? "0", cashBalance: cash?.balance ?? "0", topProducts, lowStock };
}

export { accounts, auditLogs, brands, categories, customers, dailyClosings, dueReminders, expenses, ledgerEntries, payments, products, purchaseItems, purchases, reminderSettings, saleItems, sales, shopSettings, stockTransactions, suppliers, users };
