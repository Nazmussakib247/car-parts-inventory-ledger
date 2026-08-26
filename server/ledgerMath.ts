export function normalizePhone(value?: string | null) {
  return (value || "").replace(/[^0-9+]/g, "").replace(/^\+?880/, "0");
}

export interface LedgerDelta {
  debit: number;
  credit: number;
}

export function allocatePayment(total: number, paid: number) {
  const safeTotal = Math.max(0, total);
  const safePaid = Math.max(0, paid);
  return {
    paid: Math.min(safeTotal, safePaid),
    due: Math.max(0, safeTotal - safePaid),
  };
}

export function runningBalances(entries: LedgerDelta[]) {
  let balance = 0;
  return entries.map(entry => {
    balance += entry.debit - entry.credit;
    return balance;
  });
}
