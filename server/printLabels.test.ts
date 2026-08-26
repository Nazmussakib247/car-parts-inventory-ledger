import { describe, expect, it } from "vitest";
import { defaultCopyrightFooter, taxModeLabel } from "../shared/printLabels";

describe("shared print labels", () => {
  it("keeps the configured footer and safe default", () => {
    expect(defaultCopyrightFooter("Custom footer")).toBe("Custom footer");
    expect(defaultCopyrightFooter("")).toContain("Nazmus Sakib");
  });

  it("labels tax mode for Bengali and thermal output", () => {
    expect(taxModeLabel("inclusive", true)).toBe("অন্তর্ভুক্ত");
    expect(taxModeLabel("exclusive", true)).toBe("অতিরিক্ত");
    expect(taxModeLabel("inclusive")).toBe("inclusive");
  });
});
