import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { auditLogs, dailyClosings, getDb } from "./db";
import type { TrpcContext } from "./_core/context";

function ownerContext() {
  return { user: { id: 1, openId: "closing-persistence-owner", name: "Owner", email: "owner@example.com", loginMethod: "test", role: "owner", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
}

describe("daily closing persistence", () => {
  it("creates, updates, and reads back counted amount, variance, and notes", async () => {
    const db = await getDb();
    if (!db) return;
    const caller = appRouter.createCaller(ownerContext());
    const businessDate = "2099-12-31";
    let closingId: number | undefined;
    try {
      const first = await caller.reports.saveDailyClosing({ date: businessDate, grossSales: 1500, refunds: 100, netSales: 1400, collections: 1200, totalOut: 300, expectedNet: 900, countedCash: 875, variance: -25, notes: "First count" });
      closingId = first.id;
      expect(first).toMatchObject({ businessDate, countedCash: "875.00", variance: "-25.00", notes: "First count" });
      const updated = await caller.reports.saveDailyClosing({ date: businessDate, grossSales: 1600, refunds: 100, netSales: 1500, collections: 1300, totalOut: 300, expectedNet: 1000, countedCash: 1000, variance: 0, notes: "Recounted and balanced" });
      expect(updated).toMatchObject({ id: closingId, businessDate, expectedNet: "1000.00", countedCash: "1000.00", variance: "0.00", notes: "Recounted and balanced" });
      const history = await caller.reports.dailyClosingHistory();
      expect(history.find(row => row.businessDate === businessDate)).toMatchObject({ id: closingId, countedCash: "1000.00", variance: "0.00", notes: "Recounted and balanced" });
    } finally {
      if (closingId) await db.delete(auditLogs).where(and(eq(auditLogs.entity, "daily-closing"), eq(auditLogs.entityId, closingId)));
      await db.delete(dailyClosings).where(eq(dailyClosings.businessDate, businessDate));
    }
  }, 15000);
});
