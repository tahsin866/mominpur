/**
 * Dependency-free .xlsx (Excel) export.
 *
 * keno nije likhlam:
 * - npm er "xlsx" (SheetJS) package ta 2022 theke update hoi nai, HIGH severity
 *   prototype pollution vulnerability ase, ar oi company ekhon npm registry
 *   chere cdn.sheetjs.com e chole geche. Eta add kora mane known vuln wapas.
 * - "exceljs" (21MB) / "write-excel-file" (1.8MB) maintained, kintu ei
 *   report-er moto chhoto table export er jonno 1.8MB dependency dorkar nai.
 *
 * .xlsx format ta ECMA-376 standard (2006 theke stable) — kono library er upor
 * nirbhara noy, tai ei writer future eo kaj korbe.
 *
 * Prothibis: Sheet ta ZIP + XML. Compression chara (ZIP "stored" method)
 * likha hocche, karon Excel compressed o stored — dui-i chay. Tai kono
 * compression library-r dorkar nai, code o chhoto thake.
 */

export interface ExcelSheet {
  name: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface ExcelReportConfig {
  filename: string;
  sheets: ExcelSheet[];
  title?: string;
  details?: { label: string; value: string }[];
}

/* ------------------------------------------------------------------ */
/*  Text -> XML                                                        */
/* ------------------------------------------------------------------ */

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/**
 * Excel e XML e illegal control character (0x00-0x08, 0x0B, 0x0C, 0x0E-0x1F)
 * pathale file corrupt hoye jay — oi gulo filter out kori.
 */
function escapeXml(value: string): string {
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .replace(/[&<>"']/g, (c) => XML_ESCAPES[c]);
}

/** 0 -> "A", 25 -> "Z", 26 -> "AA" */
function columnName(index: number): string {
  let name = "";
  let n = index + 1;
  while (n > 0) {
    const mod = (n - 1) % 26;
    name = String.fromCharCode(65 + mod) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

/* ------------------------------------------------------------------ */
/*  ZIP (stored, no compression)                                       */
/* ------------------------------------------------------------------ */

let crcTable: Uint32Array | null = null;

function getCrcTable(): Uint32Array {
  if (crcTable) return crcTable;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  crcTable = table;
  return table;
}

function crc32(bytes: Uint8Array): number {
  const table = getCrcTable();
  let crc = -1;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const encoder = new TextEncoder();

/** MS-DOS date/time — ZIP header e lage. */
function dosStamp(): { time: number; date: number } {
  const now = new Date();
  return {
    time: ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff,
    date:
      (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff,
  };
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

function buildZip(entries: ZipEntry[]): Uint8Array {
  const { time, date } = dosStamp();
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const { data } = entry;
    const crc = crc32(data);

    const lh = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(lh.buffer);
    lv.setUint32(0, 0x04034b50, true); // local file header signature
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0x0800, true); // flags: filename is UTF-8
    lv.setUint16(8, 0, true); // compression: stored
    lv.setUint16(10, time, true);
    lv.setUint16(12, date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true); // extra length
    lh.set(nameBytes, 30);
    local.push(lh, data);

    const ch = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(ch.buffer);
    cv.setUint32(0, 0x02014b50, true); // central directory signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, time, true);
    cv.setUint16(14, date, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true); // extra
    cv.setUint16(32, 0, true); // comment
    cv.setUint16(34, 0, true); // disk number start
    cv.setUint16(36, 0, true); // internal attrs
    cv.setUint32(38, 0, true); // external attrs
    cv.setUint32(42, offset, true); // offset of local header
    ch.set(nameBytes, 46);
    central.push(ch);

    offset += lh.length + data.length;
  }

  const centralSize = central.reduce((sum, c) => sum + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // end of central directory
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true); // comment length

  const total = offset + centralSize + eocd.length;
  const out = new Uint8Array(total);
  let cursor = 0;
  for (const chunk of [...local, ...central, eocd]) {
    out.set(chunk, cursor);
    cursor += chunk.length;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  XLSX parts                                                         */
/* ------------------------------------------------------------------ */

const CONTENT_TYPES = (sheetCount: number) =>
  `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
  `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
  `<Default Extension="xml" ContentType="application/xml"/>` +
  `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
  `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
  Array.from(
    { length: sheetCount },
    (_, i) =>
      `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  ).join("") +
  `</Types>`;

const ROOT_RELS =
  `${XML_HEADER}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
  `</Relationships>`;

const STYLES =
  `${XML_HEADER}<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
  `<fonts count="3">` +
  `<font><sz val="11"/><name val="Calibri"/></font>` +
  `<font><b/><sz val="11"/><name val="Calibri"/></font>` +
  `<font><b/><sz val="14"/><name val="Calibri"/></font>` +
  `</fonts>` +
  `<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>` +
  `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
  `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
  `<cellXfs count="3">` +
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
  `<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>` +
  `<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>` +
  `</cellXfs>` +
  `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
  `</styleSheet>`;

const STYLE = { normal: 0, bold: 1, title: 2 } as const;

function workbookXml(sheetNames: string[]): string {
  return (
    `${XML_HEADER}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"` +
    ` xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    // activeTab=0 mane file khular shathei prothom sheet ta dekhay.
    `<bookViews><workbookView activeTab="0"/></bookViews>` +
    `<sheets>` +
    sheetNames
      .map(
        (name, i) =>
          `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`
      )
      .join("") +
    `</sheets></workbook>`
  );
}

function workbookRels(sheetCount: number): string {
  return (
    `${XML_HEADER}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    Array.from(
      { length: sheetCount },
      (_, i) =>
        `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`
    ).join("") +
    `<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    `</Relationships>`
  );
}

interface Cell {
  value: string | number;
  style: number;
}

function cellXml(ref: string, cell: Cell): string {
  if (typeof cell.value === "number") {
    if (!isFinite(cell.value)) return "";
    return `<c r="${ref}"${cell.style ? ` s="${cell.style}"` : ""}><v>${cell.value}</v></c>`;
  }
  return `<c r="${ref}" t="inlineStr"${cell.style ? ` s="${cell.style}"` : ""}><is><t xml:space="preserve">${escapeXml(cell.value)}</t></is></c>`;
}

function rowXml(rowNumber: number, cells: Cell[]): string {
  const xml = cells
    .map((cell, i) => cellXml(`${columnName(i)}${rowNumber}`, cell))
    .join("");
  if (!xml) return "";
  return `<row r="${rowNumber}">${xml}</row>`;
}

function columnWidths(sheet: ExcelSheet): number[] {
  return sheet.columns.map((col, i) => {
    const longest = Math.max(
      col.length,
      ...sheet.rows.map((r) => String(r[i] ?? "").length)
    );
    return Math.min(Math.max(longest + 3, 8), 42);
  });
}

function sheetXml(sheet: ExcelSheet, config: ExcelReportConfig): string {
  const hasHeaderBlock = Boolean(config.title || config.details?.length);
  const headerRow = hasHeaderBlock ? 4 : 1;
  const bodyRows: string[] = [];

  if (config.title) {
    bodyRows.push(rowXml(1, [{ value: config.title, style: STYLE.title }]));
  }
  if (config.details?.length) {
    bodyRows.push(
      rowXml(
        2,
        config.details.map((d) => ({ value: `${d.label}: ${d.value}`, style: STYLE.normal }))
      )
    );
  }
  if (hasHeaderBlock) bodyRows.push(rowXml(3, []));

  bodyRows.push(
    rowXml(
      headerRow,
      sheet.columns.map((c) => ({ value: c, style: STYLE.bold }))
    )
  );
  sheet.rows.forEach((r, i) => {
    bodyRows.push(
      rowXml(
        headerRow + 1 + i,
        r.map((v) => ({ value: v ?? "", style: STYLE.normal }))
      )
    );
  });

  const widths = columnWidths(sheet);
  const cols =
    `<cols>` +
    widths
      .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
      .join("") +
    `</cols>`;

  return (
    `${XML_HEADER}<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<sheetViews><sheetView workbookViewId="0">` +
    `<pane ySplit="${headerRow}" topLeftCell="A${headerRow + 1}" activePane="bottomLeft" state="frozen"/>` +
    `</sheetView></sheetViews>` +
    `<sheetFormatPr defaultRowHeight="15"/>` +
    cols +
    `<sheetData>${bodyRows.join("")}</sheetData>` +
    // AutoFilter e puro range (header + data) dite hobe — shudhu header row
    // dile Excel filter dropdown dhuke data gulo render kore na.
    `<autoFilter ref="A${headerRow}:${columnName(Math.max(sheet.columns.length - 1, 0))}${headerRow + sheet.rows.length}"/>` +
    `</worksheet>`
  );
}

/** Excel e sheet name <= 31 character, ar eitaei kichu character bondho. */
function safeSheetName(name: string, taken: Set<string>): string {
  const cleaned = name.replace(/[\\/?*[\]:]/g, " ").slice(0, 31) || "Sheet";
  let candidate = cleaned;
  let n = 2;
  while (taken.has(candidate.toLowerCase())) {
    const suffix = ` (${n})`;
    candidate = `${cleaned.slice(0, 31 - suffix.length)}${suffix}`;
    n++;
  }
  taken.add(candidate.toLowerCase());
  return candidate;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function exportExcel(config: ExcelReportConfig): void {
  if (typeof document === "undefined") return;
  if (config.sheets.length === 0) return;

  const taken = new Set<string>();
  const sheets = config.sheets.map((s) => ({ ...s, name: safeSheetName(s.name, taken) }));

  const entries: ZipEntry[] = [
    { name: "[Content_Types].xml", data: encoder.encode(CONTENT_TYPES(sheets.length)) },
    { name: "_rels/.rels", data: encoder.encode(ROOT_RELS) },
    { name: "xl/workbook.xml", data: encoder.encode(workbookXml(sheets.map((s) => s.name))) },
    { name: "xl/_rels/workbook.xml.rels", data: encoder.encode(workbookRels(sheets.length)) },
    { name: "xl/styles.xml", data: encoder.encode(STYLES) },
    ...sheets.map((s, i) => ({
      name: `xl/worksheets/sheet${i + 1}.xml`,
      data: encoder.encode(sheetXml(s, config)),
    })),
  ];

  const blob = new Blob([buildZip(entries) as unknown as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = config.filename.endsWith(".xlsx")
    ? config.filename
    : `${config.filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Shathe shathe revoke korle browser download-ta refer kore parse korar age
  // URL release hoye jay — file corrupt/empty haye jay. Ektu delay dewa lagbe.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
