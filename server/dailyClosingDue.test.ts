import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { calculateDailyClosingTotals } from "./closingMath";
import { buildCustomerDueAging } from "./dueAging";
import type { TrpcContext } from "./_core/context";

function ownerContext() {
  return { user: { id: 1, openId: "closing-owner", name: "Owner", email: "owner@example.com", loginMethod: "test", role: "owner", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
}

describe("daily closing calculations", () => {
  it("reconciles active/returned sales, inflows, outflows, channels, and variance", () => {
    const result = calculateDailyClosingTotals({
      sales: [
        { total: "1000.00", paid: "700.00", status: "posted" },
        { total: "500.00", paid: "500.00", status: "returned" },
        { total: "300.00", paid: "300.00", status: "cancelled" },
      ],
      payments: [
        { partyType: "customer", method: "Cash", amount: "700.00" },
        { partyType: "customer", method: "bKash", amount: "500.00" },
        { partyType: "supplier", method: "Cash", amount: "250.00" },
        { partyType: "expense", method: "Expense", accountType: "cash", amount: "100.00" },
      ],
      expenses: [{ amount: "100.00" }],
    });
    expect(result).toMatchObject({ grossSales: 1500, refunds: 500, netSales: 1000, collections: 1200, purchasesPaid: 250, expenses: 100, totalOut: 350, expectedNet: 850, salesCount: 2, refundCount: 1, expenseCount: 1, variance: 0 });
    expect(result.channels).toEqual([{ method: "bKash", amount: 500 }, { method: "Cash", amount: 350 }]);
  });

  it("returns an empty, date-stable daily closing through the protected report contract", async () => {
    const caller = appRouter.createCaller(ownerContext());
    await expect(caller.reports.dailyClosing({ date: "2026-08-20" })).resolves.toMatchObject({ date: "2026-08-20", expectedNet: 0, channels: [] });
  });
});

describe("customer due aging", () => {
  it("keeps only positive due rows, assigns exact bucket boundaries, rounds, and sorts by due", () => {
    const now = Date.parse("2026-08-26T00:00:00.000Z");
    const day = 86400000;
    const result = buildCustomerDueAging([
      { partyId: 1, due: "0", oldestAt: new Date(now - 5 * day) },
      { partyId: 2, due: "125.456", oldestAt: new Date(now) },
      { partyId: 3, due: "900", oldestAt: new Date(now - 30 * day), references: ["sale#12", "payment#4"] },
      { partyId: 4, due: "800", oldestAt: new Date(now - 31 * day) },
      { partyId: 5, due: "700", oldestAt: new Date(now - 61 * day) },
      { partyId: 6, due: "600", oldestAt: new Date(now - 91 * day) },
    ], now);
    expect(result.map(row => [row.partyId, row.due, row.ageDays, row.bucket])).toEqual([
      [3, 900, 30, "0-30"],
      [4, 800, 31, "31-60"],
      [5, 700, 61, "61-90"],
      [6, 600, 91, "90+"],
      [2, 125.46, 0, "0-30"],
    ]);
    expect(result[0]?.references).toEqual(["sale#12", "payment#4"]);
  });

  it("returns the protected report contract with valid positive due rows", async () => {
    const caller = appRouter.createCaller(ownerContext());
    const result = await caller.reports.customerDueAging();
    expect(Array.isArray(result)).toBe(true);
    expect(result.every(row => row.due > 0 && ["0-30", "31-60", "61-90", "90+"].includes(row.bucket))).toBe(true);
  });
});
