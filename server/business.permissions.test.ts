import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "owner" | "manager" | "sales" | "storekeeper" | "accountant") {
  const user = { id: 7, openId: `test-${role}`, name: role, email: `${role}@example.com`, loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
}

describe("business role permissions", () => {
  it("allows storekeepers to access product inventory queries", async () => {
    const caller = appRouter.createCaller(context("storekeeper"));
    await expect(caller.products.list({ search: "brake" })).resolves.toEqual([]);
  });

  it("blocks sales staff from creating supplier records", async () => {
    const caller = appRouter.createCaller(context("sales"));
    await expect(caller.suppliers.create({ name: "Restricted Supplier", openingBalance: 0 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks accountants from adjusting inventory", async () => {
    const caller = appRouter.createCaller(context("accountant"));
    await expect(caller.products.adjust({ productId: 1, quantity: 2, reason: "Cycle count" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("keeps shop settings, reminder provider configuration, and demo seeding owner-manager only", async () => {
    const salesCaller = appRouter.createCaller(context("sales"));
    const storekeeperCaller = appRouter.createCaller(context("storekeeper"));
    await expect(salesCaller.settings.update({ shopName: "Restricted Shop", copyrightFooter: "Footer", defaultTaxRate: 5, taxMode: "exclusive", currency: "BDT", invoiceLanguage: "bn" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(storekeeperCaller.reminders.updateSettings({ channel: "whatsapp", messageTemplate: "Due {{amount}}", enabled: "no" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(salesCaller.demo.seed({ includeTransactions: false })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
