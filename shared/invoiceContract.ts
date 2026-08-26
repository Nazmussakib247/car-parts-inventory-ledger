import { defaultCopyrightFooter } from "./printLabels";
import { invoiceLabels, logoFallback, type InvoiceLanguage } from "./invoiceLabels";

export type InvoiceContractInput = {
  shopName: string;
  logoUrl?: string | null;
  copyrightFooter?: string | null;
  invoiceLanguage?: InvoiceLanguage;
  invoiceNo: string;
  customerName?: string | null;
  customerPhone?: string | null;
  items: { name: string; quantity: number; unitPrice: number; lineTotal: number }[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paid: number;
};

export function buildInvoicePrintContract(input: InvoiceContractInput) {
  const language = input.invoiceLanguage || "bn";
  const labels = invoiceLabels(language);
  const due = Math.max(0, input.total - input.paid);
  return {
    language,
    labels,
    metadata: { invoiceNo: input.invoiceNo, customerName: input.customerName || labels.customerFallback, customerPhone: input.customerPhone || labels.phoneFallback },
    items: input.items,
    totals: { subtotal: input.subtotal, discount: input.discount, taxRate: input.taxRate, taxAmount: input.taxAmount, total: input.total, paid: input.paid, due },
    logo: { configured: Boolean(input.logoUrl), fallbackInitial: logoFallback(input.shopName) },
    signatureLabel: labels.signature,
    footer: defaultCopyrightFooter(input.copyrightFooter),
  };
}
