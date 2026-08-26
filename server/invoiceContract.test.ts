import { describe, expect, it } from "vitest";
import { buildInvoicePrintContract } from "../shared/invoiceContract";

const base = {
  shopName: "Motive Ledger Auto Operations",
  invoiceNo: "INV-1001",
  customerName: "Rahim Motors",
  customerPhone: "01700000000",
  items: [{ name: "Oil Filter", quantity: 2, unitPrice: 550, lineTotal: 1100 }],
  subtotal: 1100,
  discount: 100,
  taxRate: 5,
  taxAmount: 50,
  total: 1050,
  paid: 700,
};

describe("rendered invoice contract", () => {
  it("contains metadata, item rows, totals, signature, footer, and logo fallback", () => {
    const contract = buildInvoicePrintContract(base);
    expect(contract.metadata).toMatchObject({ invoiceNo: "INV-1001", customerName: "Rahim Motors", customerPhone: "01700000000" });
    expect(contract.items).toHaveLength(1);
    expect(contract.items[0]).toMatchObject({ name: "Oil Filter", quantity: 2, lineTotal: 1100 });
    expect(contract.totals).toMatchObject({ subtotal: 1100, discount: 100, taxRate: 5, taxAmount: 50, total: 1050, paid: 700, due: 350 });
    expect(contract.signatureLabel).toBe("Authorized signature");
    expect(contract.footer).toContain("Nazmus Sakib");
    expect(contract.logo).toMatchObject({ configured: false, fallbackInitial: "M" });
  });

  it("preserves English and Bengali output labels", () => {
    const english = buildInvoicePrintContract({ ...base, invoiceLanguage: "en", logoUrl: "https://example.com/logo.png" });
    const bengali = buildInvoicePrintContract({ ...base, invoiceLanguage: "bn" });
    expect(english.language).toBe("en");
    expect(english.labels.invoice).toBe("INVOICE");
    expect(english.logo.configured).toBe(true);
    expect(bengali.language).toBe("bn");
    expect(bengali.labels.invoice).toBe("চালান");
    expect(bengali.labels.total).toContain("সর্বমোট");
  });
});
