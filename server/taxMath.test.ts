import { describe, expect, it } from "vitest";
import { bengaliInvoiceLabels, calculateTaxTotals, formatPrintFooter } from "./taxMath";

describe("tax and print contracts", () => {
  it("calculates tax-exclusive totals", () => {
    expect(calculateTaxTotals({ subtotal: 1000, discount: 100, taxRate: 15, taxMode: "exclusive" })).toEqual({ taxable: 900, taxAmount: 135, total: 1035 });
  });

  it("extracts tax from tax-inclusive totals", () => {
    const result = calculateTaxTotals({ subtotal: 1150, discount: 0, taxRate: 15, taxMode: "inclusive" });
    expect(result.total).toBe(1150);
    expect(result.taxAmount).toBeCloseTo(150, 8);
  });

  it("keeps the requested copyright footer and Bengali invoice labels", () => {
    expect(formatPrintFooter("  All rights Reserve by Nazmus Sakib  ")).toBe("All rights Reserve by Nazmus Sakib");
    expect(formatPrintFooter()).toBe("All rights Reserve by Nazmus Sakib");
    expect(bengaliInvoiceLabels().total).toBe("সর্বমোট");
  });
});
