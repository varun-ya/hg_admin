// CSV + PDF export utilities — zero external dependencies

export function exportCSV(filename: string, headers: string[], rows: string[][]) {
  const escape = (v: string) => {
    if (v.includes(",") || v.includes('"') || v.includes("\n")) return `"${v.replace(/"/g, '""')}"`;
    return v;
  };
  const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}.csv`);
}

export function exportPDF(filename: string, title: string, headers: string[], rows: string[][], meta?: { dateRange?: string; generatedBy?: string }) {
  const now = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const colWidths = headers.map((h, i) => {
    const maxContent = Math.max(h.length, ...rows.map((r) => (r[i] || "").length));
    return Math.min(Math.max(maxContent * 6.5, 60), 180);
  });
  const tableWidth = colWidths.reduce((a, b) => a + b, 0) + 40;
  const pageWidth = Math.max(tableWidth + 80, 595);
  const rowHeight = 28;
  const headerHeight = 32;
  const pageHeight = Math.max(rows.length * rowHeight + headerHeight + 200, 400);

  let y = 40;
  const lines: string[] = [];

  // PDF header
  lines.push(`BT /F1 16 Tf 40 ${pageHeight - y} Td (${pdfEscape(title)}) Tj ET`);
  y += 24;
  lines.push(`BT /F2 9 Tf 40 ${pageHeight - y} Td (Generated: ${now}${meta?.dateRange ? `  |  Range: ${meta.dateRange}` : ""}${meta?.generatedBy ? `  |  By: ${meta.generatedBy}` : ""}) Tj ET`);
  y += 8;
  lines.push(`BT /F2 9 Tf 40 ${pageHeight - y} Td (HomeGuru Admin — Super Admin Export) Tj ET`);
  y += 20;

  // Separator
  lines.push(`0.88 0.88 0.88 RG 40 ${pageHeight - y} m ${pageWidth + 40} ${pageHeight - y} l 0.5 w S`);
  y += 12;

  // Table header bg
  lines.push(`0.96 0.96 0.96 rg 40 ${pageHeight - y - headerHeight} ${tableWidth} ${headerHeight} re f`);
  // Table header text
  let x = 50;
  headers.forEach((h, i) => {
    lines.push(`BT /F1 8 Tf 0.4 0.4 0.4 rg ${x} ${pageHeight - y - 20} Td (${pdfEscape(h.toUpperCase())}) Tj ET`);
    x += colWidths[i];
  });
  y += headerHeight;

  // Table rows
  rows.forEach((row, ri) => {
    if (ri % 2 === 1) {
      lines.push(`0.98 0.98 0.98 rg 40 ${pageHeight - y - rowHeight} ${tableWidth} ${rowHeight} re f`);
    }
    x = 50;
    row.forEach((cell, ci) => {
      const truncated = cell.length > 30 ? cell.slice(0, 28) + "..." : cell;
      lines.push(`BT /F2 8 Tf 0.15 0.15 0.15 rg ${x} ${pageHeight - y - 18} Td (${pdfEscape(truncated)}) Tj ET`);
      x += colWidths[ci];
    });
    // Row border
    lines.push(`0.94 0.94 0.94 RG 40 ${pageHeight - y - rowHeight} m ${tableWidth + 40} ${pageHeight - y - rowHeight} l 0.3 w S`);
    y += rowHeight;
  });

  // Footer
  y += 16;
  lines.push(`0.88 0.88 0.88 RG 40 ${pageHeight - y} m ${pageWidth + 40} ${pageHeight - y} l 0.5 w S`);
  y += 14;
  lines.push(`BT /F2 7 Tf 0.6 0.6 0.6 rg 40 ${pageHeight - y} Td (This is a system-generated report from HomeGuru Admin Dashboard. All data is immutable and audit-logged.) Tj ET`);

  const content = lines.join("\n");
  const stream = `stream\n${content}\nendstream`;
  const streamLen = content.length;

  const pdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj
4 0 obj << /Length ${streamLen} >>
${stream}
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj
6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer << /Size 7 /Root 1 0 R >>
startxref
0
%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  triggerDownload(blob, `${filename}.pdf`);
}

function pdfEscape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
