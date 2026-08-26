export type TaxMode = "exclusive" | "inclusive";

export function calculateTaxTotals(input: { subtotal: number; discount: number; taxRate: number; taxMode: TaxMode }) {
  const taxable = Math.max(0, input.subtotal - input.discount);
  const taxAmount = input.taxMode === "inclusive"
    ? taxable - taxable / (1 + input.taxRate / 100)
    : taxable * input.taxRate / 100;
  const total = input.taxMode === "inclusive" ? taxable : taxable + taxAmount;
  return { taxable, taxAmount, total };
}

export function formatPrintFooter(value?: string | null) {
  return (value || "All rights Reserve by Nazmus Sakib").trim();
}

export function bengaliInvoiceLabels() {
  return { invoice: "চালান", customer: "ক্রেতা", phone: "মোবাইল", subtotal: "উপমোট", discount: "ছাড়", tax: "ভ্যাট/ট্যাক্স", total: "সর্বমোট", paid: "পরিশোধ", due: "বাকি", thankYou: "ধন্যবাদ" } as const;
}
