export function normalizeBarcode(value: string) {
  return value.replace(/[\r\n]/g, "").trim();
}

export function isScannableBarcode(value: string) {
  return normalizeBarcode(value).length >= 3;
}

export function barcodeLookupMessage(value: string, found: boolean) {
  const barcode = normalizeBarcode(value);
  return found ? "" : `No product found for barcode ${barcode}. Check the code or search by product name.`;
}
