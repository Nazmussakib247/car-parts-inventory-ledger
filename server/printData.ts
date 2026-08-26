export function buildPrintData(input: { invoiceNo: string; customerName?: string | null; customerPhone?: string | null; subtotal: number; discount: number; taxRate: number; taxAmount: number; total: number; paid: number; items: { name: string; quantity: number; unitPrice: number; lineTotal: number }[]; copyrightFooter?: string | null }) {
  return {
    ...input,
    customerName: input.customerName || "সাধারণ ক্রেতা",
    customerPhone: input.customerPhone || "—",
    due: Math.max(0, input.total - input.paid),
    copyrightFooter: input.copyrightFooter || "All rights Reserve by Nazmus Sakib",
  };
}

export function canQueueManualReminder(role: string, optIn: boolean, amount: number) {
  return ["owner", "admin", "manager", "sales"].includes(role) && optIn && amount > 0;
}
