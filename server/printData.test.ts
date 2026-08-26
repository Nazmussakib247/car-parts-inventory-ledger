import { describe, expect, it } from "vitest";
import { buildPrintData, canQueueManualReminder } from "./printData";

describe("print and reminder contracts", () => {
  it("keeps live invoice fields and derives due/footer safely", () => {
    const data = buildPrintData({ invoiceNo: "INV-001", subtotal: 1000, discount: 0, taxRate: 5, taxAmount: 50, total: 1050, paid: 700, items: [{ name: "Filter", quantity: 1, unitPrice: 1000, lineTotal: 1000 }] });
    expect(data.invoiceNo).toBe("INV-001");
    expect(data.due).toBe(350);
    expect(data.copyrightFooter).toContain("Nazmus Sakib");
    expect(data.customerName).toBe("সাধারণ ক্রেতা");
  });

  it("requires an allowed role, opt-in, and a positive amount", () => {
    expect(canQueueManualReminder("sales", true, 500)).toBe(true);
    expect(canQueueManualReminder("storekeeper", true, 500)).toBe(false);
    expect(canQueueManualReminder("sales", false, 500)).toBe(false);
    expect(canQueueManualReminder("sales", true, 0)).toBe(false);
  });
});
