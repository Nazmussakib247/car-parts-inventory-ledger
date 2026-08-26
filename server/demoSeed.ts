export const DEMO_SEED_ENTITY_GROUPS = [
  "products",
  "supplier",
  "customer",
  "accounts",
  "stock",
  "ledger",
  "purchase",
  "sale",
  "payment",
] as const;

export function demoSeedHasRequiredGroups(groups: readonly string[]) {
  return DEMO_SEED_ENTITY_GROUPS.every(group => groups.includes(group));
}
