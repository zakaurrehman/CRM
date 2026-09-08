"use client";

import type { ClientGrade } from "./alloy-client";

/**
 * Technical data export.
 *
 * CSV rather than a bundled PDF writer: a buyer taking composition data away is
 * almost always putting it into a spreadsheet or an ERP, and pdfmake/jsPDF cost
 * 300–800 kB to produce a worse artefact. PDF is covered by the print
 * stylesheet, which the browser turns into a properly paginated document with
 * real text — see the `print:` rules in globals.css.
 */

/** Escapes a field for RFC 4180. */
function cell(value: string | number | undefined): string {
  const s = value === undefined || value === null ? "" : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: (string | number | undefined)[][]): string {
  return rows.map((r) => r.map(cell).join(",")).join("\r\n");
}

/**
 * Grades as a matrix, one column per element.
 *
 * `max` and balance markers are preserved in the cell rather than flattened to
 * a bare number — exporting "2.5" where the table says "2.5 max" would turn a
 * ceiling into a nominal figure, which is exactly the kind of quiet corruption
 * that causes a wrong order.
 */
export function gradesToCsv(grades: ClientGrade[], elements: string[]): string {
  const used = elements.filter((el) => grades.some((g) => g.composition.some((c) => c.element === el)));
  const header = ["Grade", "Category", ...used, "Compounds", "Source"];

  const rows: (string | number | undefined)[][] = [
    ["IMS Metals & Alloys — nominal composition, percentage by weight"],
    [`Exported ${new Date().toISOString().slice(0, 10)}`],
    ["Values are reproduced from IMS technical data. 'max' denotes an upper limit; 'Bal.' the balance."],
    [],
    header,
  ];

  for (const g of grades) {
    const byElement = new Map(g.composition.map((c) => [c.element, c]));
    rows.push([
      g.name,
      g.categoryName,
      ...used.map((el) => {
        const c = byElement.get(el);
        if (!c) return "";
        if (c.derived) return "Bal.";
        return c.max ? `${c.pct} max` : String(c.pct);
      }),
      g.compounds?.join("; ") ?? "",
      `https://ims-metals.com${g.href}`,
    ]);
  }

  return toCsv(rows);
}

/**
 * Hands the file to the browser.
 *
 * A published artifact's sandbox blocks script-driven downloads, but this runs
 * on the real site where it is the standard route. The object URL is revoked on
 * the next frame rather than immediately, since Safari needs the click to land
 * before the URL goes away.
 */
export function downloadCsv(filename: string, csv: string): void {
  // The BOM makes Excel open UTF-8 correctly instead of mangling the degree and
  // micro signs that appear in technical notes.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  requestAnimationFrame(() => {
    a.remove();
    URL.revokeObjectURL(url);
  });
}
