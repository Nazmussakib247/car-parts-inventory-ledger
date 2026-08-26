export type InventoryStatusInput = { status: string; stockQty: number; minStock: number };

export function inventoryStatusLabel({ status, stockQty, minStock }: InventoryStatusInput) {
  if (status !== "active") return "Inactive";
  if (stockQty <= 0) return "Out of stock";
  if (stockQty <= minStock) return "Low stock";
  return "In stock";
}

export function inventoryStatusTone({ status, stockQty, minStock }: InventoryStatusInput) {
  if (status !== "active" || stockQty <= 0) return "danger" as const;
  if (stockQty <= minStock) return "warning" as const;
  return "healthy" as const;
}
