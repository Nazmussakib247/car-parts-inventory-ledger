export type ClosingSaleRow = { total: number | string; paid: number | string; status: string };
export type ClosingPaymentRow = { partyType: string; method: string; amount: number | string; accountType?: string | null };
export type ClosingExpenseRow = { amount: number | string };

export function closingChannelForPayment(row: ClosingPaymentRow) {
  if (row.partyType !== "expense" || !row.accountType) return row.method;
  if (row.accountType === "cash") return "Cash";
  if (row.accountType === "bank") return "Bank";
  if (row.accountType === "card") return "Card";
  if (row.accountType === "mobile") return "Mobile";
  return row.method;
}

export function calculateDailyClosingTotals(input: { sales: ClosingSaleRow[]; payments: ClosingPaymentRow[]; expenses: ClosingExpenseRow[] }) {
  const grossSales = input.sales.filter(row => row.status !== "cancelled").reduce((sum, row) => sum + Number(row.total), 0);
  const collections = input.payments.filter(row => row.partyType === "customer").reduce((sum, row) => sum + Number(row.amount), 0);
  const purchasesPaid = input.payments.filter(row => row.partyType === "supplier").reduce((sum, row) => sum + Number(row.amount), 0);
  const expenses = input.expenses.reduce((sum, row) => sum + Number(row.amount), 0);
  const refunds = input.sales.filter(row => row.status === "returned").reduce((sum, row) => sum + Number(row.paid), 0);
  const channels = new Map<string, number>();
  for (const row of input.payments) {
    const signed = row.partyType === "customer" ? Number(row.amount) : -Number(row.amount);
    const channel = closingChannelForPayment(row);
    channels.set(channel, (channels.get(channel) || 0) + signed);
  }
  const channelRows = Array.from(channels, ([method, amount]) => ({ method, amount: Number(amount.toFixed(2)) })).sort((a, b) => a.method.localeCompare(b.method));
  const totalOut = purchasesPaid + expenses;
  const netSales = grossSales - refunds;
  const expectedNet = collections - totalOut;
  return {
    grossSales,
    refunds,
    netSales,
    collections,
    purchasesPaid,
    expenses,
    totalOut,
    expectedNet,
    salesCount: input.sales.filter(row => row.status !== "cancelled").length,
    refundCount: input.sales.filter(row => row.status === "returned").length,
    expenseCount: input.expenses.length,
    channels: channelRows,
    variance: Number((collections - totalOut - expectedNet).toFixed(2)),
  };
}
