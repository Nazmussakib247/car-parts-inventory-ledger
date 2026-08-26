import { boolean, date, decimal, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["owner", "manager", "sales", "storekeeper", "accountant", "admin", "user"]).default("sales").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const brands = mysqlTable("brands", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sku: varchar("sku", { length: 64 }).notNull().unique(),
  barcode: varchar("barcode", { length: 80 }).unique(),
  name: varchar("name", { length: 180 }).notNull(),
  partNumber: varchar("partNumber", { length: 120 }),
  categoryId: int("categoryId"),
  brandId: int("brandId"),
  vehicleCompatibility: text("vehicleCompatibility"),
  purchasePrice: decimal("purchasePrice", { precision: 12, scale: 2 }).default("0").notNull(),
  sellingPrice: decimal("sellingPrice", { precision: 12, scale: 2 }).default("0").notNull(),
  wholesalePrice: decimal("wholesalePrice", { precision: 12, scale: 2 }).default("0"),
  minStock: int("minStock").default(0).notNull(),
  stockQty: int("stockQty").default(0).notNull(),
  rackLocation: varchar("rackLocation", { length: 80 }),
  unit: varchar("unit", { length: 30 }).default("Piece").notNull(),
  warranty: varchar("warranty", { length: 80 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ productNameIdx: index("product_name_idx").on(table.name), stockIdx: index("product_stock_idx").on(table.stockQty) }));

export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 180 }),
  address: text("address"),
  customerType: varchar("customerType", { length: 40 }).default("Retail").notNull(),
  openingBalance: decimal("openingBalance", { precision: 12, scale: 2 }).default("0").notNull(),
  creditLimit: decimal("creditLimit", { precision: 12, scale: 2 }).default("0").notNull(),
  vehicleInfo: text("vehicleInfo"),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  contactPerson: varchar("contactPerson", { length: 120 }),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 180 }),
  address: text("address"),
  openingBalance: decimal("openingBalance", { precision: 12, scale: 2 }).default("0").notNull(),
  paymentTerms: varchar("paymentTerms", { length: 100 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const accounts = mysqlTable("accounts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  type: mysqlEnum("type", ["cash", "bank", "mobile", "card"]).notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
});

export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  billNo: varchar("billNo", { length: 40 }).notNull().unique(),
  supplierId: int("supplierId").notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).default("0").notNull(),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0").notNull(),
  paid: decimal("paid", { precision: 12, scale: 2 }).default("0").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 30 }),
  status: mysqlEnum("status", ["received", "partial", "paid", "cancelled"]).default("received").notNull(),
  notes: text("notes"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ supplierIdx: index("purchase_supplier_idx").on(table.supplierId), dateIdx: index("purchase_date_idx").on(table.createdAt) }));

export const purchaseItems = mysqlTable("purchase_items", {
  id: int("id").autoincrement().primaryKey(),
  purchaseId: int("purchaseId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  unitCost: decimal("unitCost", { precision: 12, scale: 2 }).notNull(),
  lineTotal: decimal("lineTotal", { precision: 12, scale: 2 }).notNull(),
});

export const shopSettings = mysqlTable("shop_settings", {
  id: int("id").autoincrement().primaryKey(),
  shopName: varchar("shopName", { length: 180 }).notNull().default("Motive Ledger Auto Operations"),
  address: text("address"),
  phone: varchar("phone", { length: 40 }),
  logoUrl: text("logoUrl"),
  vatNumber: varchar("vatNumber", { length: 80 }),
  copyrightFooter: varchar("copyrightFooter", { length: 180 }).default("All rights Reserve by Nazmus Sakib").notNull(),
  defaultTaxRate: decimal("defaultTaxRate", { precision: 5, scale: 2 }).default("0").notNull(),
  taxMode: mysqlEnum("taxMode", ["exclusive", "inclusive"]).default("exclusive").notNull(),
  currency: varchar("currency", { length: 10 }).default("BDT").notNull(),
  invoiceLanguage: varchar("invoiceLanguage", { length: 20 }).default("bn").notNull(),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  invoiceNo: varchar("invoiceNo", { length: 40 }).notNull().unique(),
  customerId: int("customerId"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0").notNull(),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0").notNull(),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).default("0").notNull(),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }).default("0").notNull(),
  taxMode: mysqlEnum("taxMode", ["exclusive", "inclusive"]).default("exclusive").notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).default("0").notNull(),
  paid: decimal("paid", { precision: 12, scale: 2 }).default("0").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 30 }),
  status: mysqlEnum("status", ["completed", "partial", "paid", "returned", "cancelled"]).default("completed").notNull(),
  notes: text("notes"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ customerIdx: index("sale_customer_idx").on(table.customerId), dateIdx: index("sale_date_idx").on(table.createdAt) }));

export const saleItems = mysqlTable("sale_items", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
  unitCost: decimal("unitCost", { precision: 12, scale: 2 }).default("0").notNull(),
  lineTotal: decimal("lineTotal", { precision: 12, scale: 2 }).notNull(),
});

export const ledgerEntries = mysqlTable("ledger_entries", {
  id: int("id").autoincrement().primaryKey(),
  partyType: mysqlEnum("partyType", ["customer", "supplier"]).notNull(),
  partyId: int("partyId").notNull(),
  referenceType: varchar("referenceType", { length: 30 }).notNull(),
  referenceId: int("referenceId"),
  debit: decimal("debit", { precision: 12, scale: 2 }).default("0").notNull(),
  credit: decimal("credit", { precision: 12, scale: 2 }).default("0").notNull(),
  description: text("description"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ partyIdx: index("ledger_party_idx").on(table.partyType, table.partyId), dateIdx: index("ledger_date_idx").on(table.createdAt) }));

export const stockTransactions = mysqlTable("stock_transactions", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  transactionType: varchar("transactionType", { length: 30 }).notNull(),
  quantity: int("quantity").notNull(),
  referenceType: varchar("referenceType", { length: 30 }),
  referenceId: int("referenceId"),
  reason: text("reason"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ productIdx: index("stock_product_idx").on(table.productId), dateIdx: index("stock_date_idx").on(table.createdAt) }));

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  partyType: mysqlEnum("partyType", ["customer", "supplier", "expense"]).notNull(),
  partyId: int("partyId"),
  accountId: int("accountId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 30 }).notNull(),
  reference: varchar("reference", { length: 100 }),
  notes: text("notes"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 80 }).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  accountId: int("accountId").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const dailyClosings = mysqlTable("daily_closings", {
  id: int("id").autoincrement().primaryKey(),
  businessDate: date("businessDate", { mode: "string" }).notNull().unique(),
  grossSales: decimal("grossSales", { precision: 12, scale: 2 }).default("0").notNull(),
  refunds: decimal("refunds", { precision: 12, scale: 2 }).default("0").notNull(),
  netSales: decimal("netSales", { precision: 12, scale: 2 }).default("0").notNull(),
  collections: decimal("collections", { precision: 12, scale: 2 }).default("0").notNull(),
  totalOut: decimal("totalOut", { precision: 12, scale: 2 }).default("0").notNull(),
  expectedNet: decimal("expectedNet", { precision: 12, scale: 2 }).default("0").notNull(),
  countedCash: decimal("countedCash", { precision: 12, scale: 2 }).default("0").notNull(),
  variance: decimal("variance", { precision: 12, scale: 2 }).default("0").notNull(),
  notes: text("notes"),
  closedBy: int("closedBy").notNull(),
  closedAt: timestamp("closedAt").defaultNow().notNull(),
});

export const reminderSettings = mysqlTable("reminder_settings", {
  id: int("id").autoincrement().primaryKey(),
  channel: mysqlEnum("channel", ["whatsapp", "sms"]).notNull(),
  providerName: varchar("providerName", { length: 80 }),
  apiBaseUrl: text("apiBaseUrl"),
  senderId: varchar("senderId", { length: 100 }),
  messageTemplate: text("messageTemplate").notNull(),
  enabled: mysqlEnum("enabled", ["yes", "no"]).default("no").notNull(),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const dueReminders = mysqlTable("due_reminders", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  channel: mysqlEnum("channel", ["whatsapp", "sms", "manual"]).notNull(),
  phone: varchar("phone", { length: 40 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["queued", "sent", "failed", "manual"]).default("queued").notNull(),
  optIn: boolean("optIn").default(false).notNull(),
  providerResponse: text("providerResponse"),
  sentAt: timestamp("sentAt"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ customerIdx: index("reminder_customer_idx").on(table.customerId), statusIdx: index("reminder_status_idx").on(table.status) }));

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 80 }).notNull(),
  entity: varchar("entity", { length: 80 }).notNull(),
  entityId: int("entityId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type ReminderSetting = typeof reminderSettings.$inferSelect;
export type DueReminder = typeof dueReminders.$inferSelect;
