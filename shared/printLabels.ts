export function defaultCopyrightFooter(value?: string | null) {
  return value || "All rights Reserve by Nazmus Sakib";
}

export function taxModeLabel(mode: "exclusive" | "inclusive", bangla = false) {
  if (bangla) return mode === "inclusive" ? "অন্তর্ভুক্ত" : "অতিরিক্ত";
  return mode === "inclusive" ? "inclusive" : "exclusive";
}
