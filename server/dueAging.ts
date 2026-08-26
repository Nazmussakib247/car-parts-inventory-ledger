export type CustomerDueRow = { partyId: number; due: number | string; oldestAt: string | Date | null; references?: string[] };
export type CustomerDueAgingRow = { partyId: number; due: number; oldestAt: string | Date | null; references: string[]; ageDays: number; bucket: "0-30" | "31-60" | "61-90" | "90+" };

export function buildCustomerDueAging(rows: CustomerDueRow[], now = Date.now()): CustomerDueAgingRow[] {
  return rows
    .filter(row => Number(row.due) > 0)
    .map(row => {
      const oldest = row.oldestAt ? new Date(row.oldestAt).getTime() : now;
      const ageDays = Math.max(0, Math.floor((now - oldest) / 86400000));
      const bucket: CustomerDueAgingRow["bucket"] = ageDays > 90 ? "90+" : ageDays > 60 ? "61-90" : ageDays > 30 ? "31-60" : "0-30";
      return { partyId: row.partyId, due: Number(Number(row.due).toFixed(2)), oldestAt: row.oldestAt, references: row.references || [], ageDays, bucket };
    })
    .sort((a, b) => b.due - a.due);
}
