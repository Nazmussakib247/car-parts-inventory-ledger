export type DailySalesRow = { date: string; sales: number | string; collections: number | string };

export function buildDailySalesSeries(rows: DailySalesRow[], now = new Date(), days = 7) {
  const count = days === 30 ? 30 : 7;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (count - 1));
  const byDate = new Map(rows.map(row => [String(row.date).slice(0, 10), { sales: Number(row.sales), collections: Number(row.collections) }]));
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { date: key, ...(byDate.get(key) ?? { sales: 0, collections: 0 }) };
  });
}

export function normalizeInventoryStatus(value: { healthy?: number | string; lowStock?: number | string; outOfStock?: number | string }) {
  return { healthy: Number(value.healthy ?? 0), lowStock: Number(value.lowStock ?? 0), outOfStock: Number(value.outOfStock ?? 0) };
}
