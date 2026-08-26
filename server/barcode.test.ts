import { describe, expect, it } from "vitest";
import { barcodeLookupMessage, isScannableBarcode, normalizeBarcode } from "./barcode";

describe("barcode scanner contract", () => {
  it("removes scanner line breaks and whitespace", () => {
    expect(normalizeBarcode(" 890000000001\r\n")).toBe("890000000001");
  });

  it("accepts a real scan and rejects an empty/short value", () => {
    expect(isScannableBarcode("890000000001")).toBe(true);
    expect(isScannableBarcode("  ")).toBe(false);
    expect(isScannableBarcode("12")).toBe(false);
  });

  it("returns an actionable not-found message for an unmatched scan", () => {
    expect(barcodeLookupMessage(" 890000000001\r\n", false)).toContain("No product found for barcode 890000000001");
    expect(barcodeLookupMessage("890000000001", true)).toBe("");
  });
});
