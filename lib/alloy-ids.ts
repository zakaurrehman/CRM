import { normalise } from "./utils";

/**
 * Grade identity, on its own so both sides can import it.
 *
 * lib/alloy-data.ts owns the parsing, but it imports the full composition
 * tables — so a client component that only needs to work out a grade's id would
 * drag 37 kB of chemistry into the bundle to call a two-line function. These
 * live here instead, free of any data import.
 *
 * The id keys the comparison tray, saved materials and RFQ lines, so it has to
 * stay stable: it is derived from the category slug and the published grade
 * name, and nothing else.
 */
export function gradeAnchor(name: string): string {
  return "grade-" + normalise(name).replace(/ /g, "-");
}

export function gradeId(categorySlug: string, name: string): string {
  return categorySlug + ":" + normalise(name).replace(/ /g, "-");
}
