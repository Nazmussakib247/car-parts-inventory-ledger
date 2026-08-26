import { describe, expect, it } from "vitest";
import { buildDailySalesSeries, normalizeInventoryStatus } from "./dashboardAnalytics";

describe("dashboard analytics", () => {
  it("returns a seven-day series and fills missing dates with zeroes", () => {
    const result = buildDailySalesSeries([{ date: "2026-08-21", sales: "2350", collections: "1500" }], new Date("2026-08-21T12:00:00Z"));
    expect(result).toHaveLength(7);
    expect(result.at(-1)).toMatchObject({ date: "2026-08-21", sales: 2350, collections: 1500 });
    expect(result.slice(0, -1).every(row => row.sales === 0 && row.collections === 0)).toBe(true);
  });

  it("normalizes inventory buckets to numeric values", () => {
    expect(normalizeInventoryStatus({ healthy: "4", lowStock: 2, outOfStock: undefined })).toEqual({ healthy: 4, lowStock: 2, outOfStock: 0 });
  });
});
