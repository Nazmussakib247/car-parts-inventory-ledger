import { normalizePhone } from "./ledgerMath";

export type PhoneCandidate = { id: number; phone?: string | null };

export function findCustomerByPhone(candidates: PhoneCandidate[], rawPhone?: string | null) {
  const normalized = normalizePhone(rawPhone);
  if (!normalized) return undefined;
  return candidates.find(candidate => normalizePhone(candidate.phone) === normalized)?.id;
}

export function shouldCreateQuickCustomer(customerId: number | null | undefined, customerName?: string | null) {
  return !customerId && Boolean(customerName?.trim());
}

export function accountTypeForPaymentMethod(method: string) {
  if (method === "Cash") return "cash" as const;
  if (method === "Bank") return "bank" as const;
  if (method === "Card") return "card" as const;
  return "mobile" as const;
}

export function shouldProvisionPaymentAccount(accountId: number | undefined, paid: number, paymentMethod?: string | null) {
  return paid > 0 && Boolean(paymentMethod) && !accountId;
}

export function isDemoSeeded(existingBillNo?: string | null) {
  return existingBillNo === "DEMO-BILL-001";
}
