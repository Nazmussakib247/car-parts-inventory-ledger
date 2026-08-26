import * as XLSX from "xlsx";

export type ExportCell = string | number;

export function createReportWorkbook(rows: ExportCell[][], sheetName = "Report") {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return workbook;
}
