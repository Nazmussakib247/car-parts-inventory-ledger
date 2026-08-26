import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { allocatePayment, normalizePhone, runningBalances } from "./ledgerMath";
import { accountTypeForPaymentMethod, findCustomerByPhone, isDemoSeeded, shouldCreateQuickCustomer, shouldProvisionPaymentAccount } from "./quickSale";
import { DEMO_SEED_ENTITY_GROUPS, demoSeedHasRequiredGroups } from "./demoSeed";

function ownerContext() {
  return { user: { id: 1, openId: "workflow-owner", name: "Owner", email: "owner@example.com", loginMethod: "test", role: "owner", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
}

describe("business workflow contracts", () => {
  it("accepts date-filtered report requests without a database connection", async () => {
    const caller = appRouter.createCaller(ownerContext());
    await expect(caller.reports.sales({ from: "2026-01-01", to: "2026-01-31" })).resolves.toMatchObject({ rows: [] });
    await expect(caller.reports.purchases({ from: "2026-01-01", to: "2026-01-31" })).resolves.toMatchObject({ rows: [] });
    await expect(caller.reports.expenses({ from: "2026-01-01", to: "2026-01-31" })).resolves.toMatchObject({ rows: [] });
  }, 15000);

  it("calculates chronological ledger running balances", () => { expect(runningBalances([{ debit: 1000, credit: 0 }, { debit: 0, credit: 300 }, { debit: 250, credit: 0 }])).toEqual([1000, 700, 950]); });

  it("allocates partial payments without exceeding the invoice total", () => { expect(allocatePayment(1000, 350)).toEqual({ paid: 350, due: 650 }); expect(allocatePayment(1000, 1500)).toEqual({ paid: 1000, due: 0 }); });

  it("normalizes Bangladesh phone formats for quick-sale matching", () => { expect(normalizePhone("+880 1700-000-002")).toBe("01700000002"); expect(normalizePhone("01700000002")).toBe("01700000002"); });

  it("reuses a formatted duplicate phone and creates only when needed", () => { expect(findCustomerByPhone([{ id: 7, phone: "01700000002" }], "+880 1700-000-002")).toBe(7); expect(findCustomerByPhone([{ id: 7, phone: "01700000002" }], "01800000003")).toBeUndefined(); expect(shouldCreateQuickCustomer(null, "New Buyer")).toBe(true); expect(shouldCreateQuickCustomer(7, "New Buyer")).toBe(false); });

  it("provisions payment accounts and keeps demo seeding idempotent", () => { expect(accountTypeForPaymentMethod("Cash")).toBe("cash"); expect(accountTypeForPaymentMethod("bKash")).toBe("mobile"); expect(shouldProvisionPaymentAccount(undefined, 100, "Cash")).toBe(true); expect(shouldProvisionPaymentAccount(9, 100, "Cash")).toBe(false); expect(isDemoSeeded("DEMO-BILL-001")).toBe(true); expect(isDemoSeeded(undefined)).toBe(false); expect(demoSeedHasRequiredGroups(DEMO_SEED_ENTITY_GROUPS)).toBe(true); expect(demoSeedHasRequiredGroups(DEMO_SEED_ENTITY_GROUPS.filter(group => group !== "payment"))).toBe(false); });

  it("rejects paid sales without a payment method", async () => { const caller = appRouter.createCaller(ownerContext()); await expect(caller.sales.create({ customerId: null, customerName: "Quick Customer", customerPhone: "01700000002", items: [{ productId: 1, quantity: 1, unitPrice: 100 }], discount: 0, paid: 50 })).rejects.toMatchObject({ code: "BAD_REQUEST" }); });

  it("rejects duplicate payment-account names with a clear validation error", async () => { const caller = appRouter.createCaller(ownerContext()); await expect(caller.accounts.create({ name: "Demo Cash", type: "cash" })).rejects.toMatchObject({ code: "BAD_REQUEST" }); });

  it("rejects invalid return payloads before touching business logic", async () => {
    const caller = appRouter.createCaller(ownerContext());
    await expect(caller.sales.returnItems({ id: 0, items: [], reason: "x" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
