import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { createReportWorkbook } from "../shared/exportWorkbook";

describe("report workbook exports", () => {
  it("creates a readable workbook with populated report rows", () => {
    const workbook = createReportWorkbook([["Invoice", "Total"], ["INV-001", 2350]], "Invoice");
    const sheet = workbook.Sheets.Invoice;
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
    expect(workbook.SheetNames).toEqual(["Invoice"]);
    expect(rows).toEqual([["Invoice", "Total"], ["INV-001", 2350]]);
  });
});
