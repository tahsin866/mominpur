import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMonth(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  PDF Export                                                         */
/* ------------------------------------------------------------------ */

export function exportPDF(
  title: string,
  columns: string[],
  rows: (string | number)[][],
  summaryLines?: string[]
) {
  const doc = new jsPDF({ orientation: rows[0]?.length > 5 ? "landscape" : "portrait" });

  doc.setFontSize(16);
  doc.text(title, 14, 20);

  if (summaryLines?.length) {
    doc.setFontSize(10);
    summaryLines.forEach((line, i) => {
      doc.text(line, 14, 30 + i * 6);
    });
  }

  const startY = summaryLines?.length ? 30 + summaryLines.length * 6 + 4 : 30;

  autoTable(doc, {
    head: [columns],
    body: rows.map((r) => r.map(String)),
    startY,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: [10, 61, 42],
      textColor: 255,
      fontSize: 9,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${title}.pdf`);
}

/* ------------------------------------------------------------------ */
/*  Excel Export                                                       */
/* ------------------------------------------------------------------ */

interface SheetData {
  name: string;
  columns: string[];
  rows: (string | number)[][];
}

export function exportExcel(filename: string, sheets: SheetData[]) {
  const wb = XLSX.utils.book_new();

  sheets.forEach((s) => {
    const data = [s.columns, ...s.rows];
    const ws = XLSX.utils.aoa_to_sheet(data);

    ws["!cols"] = s.columns.map((col, i) => {
      const maxLen = Math.max(
        col.length,
        ...s.rows.map((r) => String(r[i] ?? "").length)
      );
      return { wch: Math.min(maxLen + 4, 40) };
    });

    XLSX.utils.book_append_sheet(wb, ws, s.name.substring(0, 31));
  });

  XLSX.writeFile(wb, `${filename}.xlsx`);
}
