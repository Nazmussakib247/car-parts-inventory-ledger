import { describe, expect, it } from "vitest";
import { inventoryStatusLabel, inventoryStatusTone } from "../shared/inventoryStatus";

describe("POS inventory status labels", () => {
  it("distinguishes inactive, out-of-stock, low-stock, and healthy products", () => {
    expect(inventoryStatusLabel({ status: "inactive", stockQty: 20, minStock: 5 })).toBe("Inactive");
    expect(inventoryStatusLabel({ status: "active", stockQty: 0, minStock: 5 })).toBe("Out of stock");
    expect(inventoryStatusLabel({ status: "active", stockQty: 5, minStock: 5 })).toBe("Low stock");
    expect(inventoryStatusLabel({ status: "active", stockQty: 6, minStock: 5 })).toBe("In stock");
    expect(inventoryStatusTone({ status: "active", stockQty: 0, minStock: 5 })).toBe("danger");
    expect(inventoryStatusTone({ status: "active", stockQty: 5, minStock: 5 })).toBe("warning");
    expect(inventoryStatusTone({ status: "active", stockQty: 6, minStock: 5 })).toBe("healthy");
  });
});
