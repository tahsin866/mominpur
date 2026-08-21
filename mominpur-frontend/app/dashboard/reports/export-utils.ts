import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
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

export function formatCell(value: string | number): string {
  return typeof value === "number" ? value.toLocaleString("en-US") : value;
}

/* ------------------------------------------------------------------ */
/*  PDF Export (browser-rendered, Bengali-safe)                        */
/* ------------------------------------------------------------------ */

const EXPORT_ROOT_ID = "__mominpur_pdf_export_root";

export interface PdfReportConfig {
  title: string;
  subtitle: string;
  details?: { label: string; value: string }[];
  columns: string[];
  rows: (string | number)[][];
}

export async function exportPDF(config: PdfReportConfig) {
  if (typeof document === "undefined") return;

  const { title, subtitle, details, columns, rows } = config;
  const landscape = columns.length > 5;

  const fontStack =
    "'Noto Sans Bengali','Noto Sans','Hind Siliguri',-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

  const ROOT_CSS =
    "position:absolute;left:-9999px;top:0;width:1000px;background:#ffffff;color:#111827;z-index:-1;";

  const detailsHtml = details?.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:6px 28px;margin:14px 28px 0;padding:12px 16px;border:1px solid #e5e7eb;border-radius:8px;font-size:11.5px;line-height:1.7;">` +
      details
        .map(
          (d) =>
            `<div style="white-space:nowrap;"><span style="color:#6b7280;">${d.label}:</span> <span style="font-weight:600;color:#111827;">${d.value}</span></div>`
        )
        .join("") +
      `</div>`
    : "";

  const headerBlock =
    `<div data-export-header style="font-family:${fontStack};padding:28px 28px 0;text-align:center;">` +
    `<h1 style="font-size:19px;font-weight:700;margin:0;color:#0a3d2a;">${title}</h1>` +
    `<p style="font-size:13.5px;font-weight:600;margin:6px 0 0;color:#374151;">${subtitle}</p>` +
    `</div>` +
    detailsHtml;

  const thead =
    `<thead><tr style="background:#0a3d2a;color:#ffffff;">` +
    columns.map((c) => `<th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:600;">${c}</th>`).join("") +
    `</tr></thead>`;

  const rowHtml = (r: (string | number)[], i: number) =>
    `<tr style="background:${i % 2 === 1 ? "#f5f5f5" : "#ffffff"};">` +
    r.map((cell) => `<td style="padding:7px 10px;font-size:11px;">${formatCell(cell)}</td>`).join("") +
    `</tr>`;

  const buildPageHtml = (rowIndexes: number[], includeHeader: boolean) =>
    `<div style="font-family:${fontStack};background:#ffffff;color:#111827;">` +
    (includeHeader ? headerBlock : "") +
    `<div style="padding:${includeHeader ? "16px 28px 28px" : "28px"};">` +
    `<table style="border-collapse:collapse;width:100%;table-layout:auto;">${thead}<tbody>${rowIndexes
      .map((i) => rowHtml(rows[i], i))
      .join("")}</tbody></table>` +
    `</div>` +
    `</div>`;

  const pdf = new jsPDF({ orientation: landscape ? "landscape" : "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidthPt = pageWidth - margin * 2;
  const contentHeightPt = pageHeight - margin * 2;

  /* ---------- Measurement pass: koto row e page e fit hobe ---------- */
  const measureRoot = document.createElement("div");
  measureRoot.id = EXPORT_ROOT_ID;
  measureRoot.style.cssText = ROOT_CSS;
  measureRoot.innerHTML = buildPageHtml(
    rows.map((_, i) => i),
    true
  );
  document.body.appendChild(measureRoot);

  const cssWidth = measureRoot.clientWidth || 1000;
  const ptPerCss = contentWidthPt / cssWidth;
  const BOTTOM_GAP_PT = 3;
  const pageCapacityPx = Math.floor((contentHeightPt - BOTTOM_GAP_PT) / ptPerCss);

  const tableEl = measureRoot.querySelector("table");
  const headerBlockEl = measureRoot.querySelector("[data-export-header]");
  const headerBlockH = headerBlockEl ? headerBlockEl.getBoundingClientRect().height : 0;
  const theadH = tableEl?.querySelector("thead")?.getBoundingClientRect().height ?? 0;
  const rowHeights = Array.from(tableEl?.querySelectorAll("tbody tr") ?? []).map(
    (r) => r.getBoundingClientRect().height
  );

  document.body.removeChild(measureRoot);

  /* ---------- Row chunking: kono row kata jabe na ---------- */
  const FIRST_PAGE_EXTRA_PX = 44; // 16px top + 28px bottom padding
  const CONT_PAGE_EXTRA_PX = 56; // 28px top + 28px bottom padding
  const firstPageCap = Math.max(pageCapacityPx - headerBlockH - theadH - FIRST_PAGE_EXTRA_PX, theadH + 40);
  const contPageCap = Math.max(pageCapacityPx - theadH - CONT_PAGE_EXTRA_PX, theadH + 40);

  const pages: number[][] = [];
  let currentChunk: number[] = [];
  let usedPx = 0;
  let cap = firstPageCap;
  rowHeights.forEach((h, i) => {
    if (currentChunk.length && usedPx + h > cap) {
      pages.push(currentChunk);
      currentChunk = [];
      usedPx = 0;
      cap = contPageCap;
    }
    currentChunk.push(i);
    usedPx += h;
  });
  if (currentChunk.length) pages.push(currentChunk);
  if (pages.length === 0) pages.push([]);

  /* ---------- Render each page ---------- */
  try {
    for (let p = 0; p < pages.length; p++) {
      const root = document.createElement("div");
      root.id = EXPORT_ROOT_ID;
      root.style.cssText = ROOT_CSS;
      root.innerHTML = buildPageHtml(pages[p], p === 0);
      document.body.appendChild(root);

      const canvas = await html2canvas(root, {
        scale: 2,
        backgroundColor: "#FFFFFF",
        useCORS: true,
        logging: false,
        windowWidth: 1000,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const imgHeight = (canvas.height * contentWidthPt) / canvas.width;

      if (p > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, margin, contentWidthPt, imgHeight);
      document.body.removeChild(root);
    }

    pdf.save(`${subtitle || title}.pdf`);
  } finally {
    const leftover = document.getElementById(EXPORT_ROOT_ID);
    if (leftover) leftover.remove();
  }
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
