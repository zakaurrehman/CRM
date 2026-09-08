import { alloyCategories } from "@/data/alloys";
import type { AlloyCategory, AlloyGrade, AlloyGroup } from "@/types/content";
import type { ElementThresholds } from "./alloy-query";
import { gradeAnchor, gradeId } from "./alloy-ids";

/**
 * Turns the published composition tables into structured, queryable data.
 *
 * The source tables are strings, because that is how IMS publishes them and the
 * brief requires the printed values to survive untouched. Searching, comparing
 * and filtering by element all need numbers, so this module parses the strings
 * once without ever discarding the original.
 *
 * The grammar, derived by scanning all 295 grades rather than assumed:
 *
 *   "57"        nominal percentage
 *   "1.0*"      an upper limit, not a nominal figure
 *   "BAL"       the balance of the alloy
 *   "5xC"       a ratio to carbon, a specification convention, not a quantity
 *   "8.0 TiC"   a compound rather than a free element
 *   ""          the source table left it unspecified
 *
 * The Others column carries real element data in a "value symbol" form,
 * comma-separated when there is more than one — "0.5 Zr, 0.2 Ti". Parsing it
 * matters: without it a search for vanadium or boron misses every grade where
 * that element only appears in Others.
 *
 * This module imports the full composition tables and must stay server-only.
 * Client features read the projection served by /api/alloy-index instead.
 */

export type ValueKind = "nominal" | "max" | "balance" | "ratio" | "compound" | "absent";

export interface ParsedCell {
  kind: ValueKind;
  /** Percentage by weight. Absent for kinds that carry no quantity. */
  pct?: number;
  /** The value exactly as published, for display. */
  raw: string;
}

export interface ElementAmount {
  element: string;
  pct: number;
  /** The figure is a ceiling ("1.0*"), not a nominal composition. */
  max: boolean;
  /**
   * Computed as the remainder rather than published. Never shown as a number —
   * the table prints "Bal." — but needed so a range filter can rank the grade.
   */
  derived?: boolean;
}

const NUMERIC = /^(\d+(?:\.\d+)?)(\*?)$/;
/** "0.35* V" / "12.2 TiC" — a quantity followed by an element or compound symbol. */
const QUANTIFIED_SYMBOL = /^(\d+(?:\.\d+)?)(\*?)\s+([A-Za-z][A-Za-z0-9]*)$/;
const RATIO = /^(\d+(?:\.\d+)?)x([A-Z][a-z]?)$/;
/** Compounds ride in element columns on the carbide grades; they are not free metal. */
const COMPOUND = /^(?:[A-Z][a-z]?)+C$/;

export function parseCell(raw: string): ParsedCell {
  const value = raw.trim();
  if (!value) return { kind: "absent", raw };
  if (value.toUpperCase() === "BAL") return { kind: "balance", raw };

  const numeric = NUMERIC.exec(value);
  if (numeric) {
    return { kind: numeric[2] ? "max" : "nominal", pct: Number(numeric[1]), raw };
  }

  if (RATIO.test(value)) return { kind: "ratio", raw };

  const symbol = QUANTIFIED_SYMBOL.exec(value);
  if (symbol && COMPOUND.test(symbol[3]) && symbol[3].length > 2) {
    return { kind: "compound", pct: Number(symbol[1]), raw };
  }
  return { kind: "absent", raw };
}

/** Splits an Others cell into the element amounts hiding inside it. */
export function parseOthers(raw: string): { amounts: ElementAmount[]; compounds: string[] } {
  const amounts: ElementAmount[] = [];
  const compounds: string[] = [];
  for (const part of raw.split(",")) {
    const match = QUANTIFIED_SYMBOL.exec(part.trim());
    if (!match) continue;
    const [, num, star, symbol] = match;
    // N2 and O2 are published as gas notation; the element is N and O.
    const element = /^[NO]2$/.test(symbol) ? symbol[0] : symbol;
    if (COMPOUND.test(element) && element.length > 2) {
      compounds.push(part.trim());
      continue;
    }
    amounts.push({ element, pct: Number(num), max: Boolean(star) });
  }
  return { amounts, compounds };
}

export interface IndexedGrade {
  id: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  group: AlloyGroup;
  properties: string[];
  applications: string[];
  /** Element symbol to amount, merged from the element columns and Others. */
  composition: ElementAmount[];
  /** Compounds such as TiC, kept apart from free elements. */
  compounds: string[];
  href: string;
}

/* Re-exported so server callers have one import for the whole module, while the
   definitions stay in a file the browser can import without the alloy tables. */
export { gradeAnchor, gradeId } from "./alloy-ids";

export function indexGrade(category: AlloyCategory, grade: AlloyGrade): IndexedGrade {
  const byElement = new Map<string, ElementAmount>();
  const compounds: string[] = [];
  let balanceElement: string | null = null;
  let known = 0;

  category.elements.forEach((element, i) => {
    const raw = grade.values[i] ?? "";
    if (element === "Others") {
      const others = parseOthers(raw);
      for (const amount of others.amounts) {
        if (!byElement.has(amount.element)) byElement.set(amount.element, amount);
        if (!amount.max) known += amount.pct;
      }
      compounds.push(...others.compounds);
      return;
    }

    const cell = parseCell(raw);
    if (cell.kind === "balance") {
      balanceElement = element;
      return;
    }
    if (cell.kind === "compound") {
      compounds.push(cell.raw);
      return;
    }
    if (cell.pct === undefined) return;
    byElement.set(element, { element, pct: cell.pct, max: cell.kind === "max" });
    if (cell.kind === "nominal") known += cell.pct;
  });

  /* "BAL" is the remainder by definition, so deriving it is arithmetic rather
     than invention — but it is still not a published figure, so it is flagged
     and never printed as a number. */
  if (balanceElement) {
    byElement.set(balanceElement, {
      element: balanceElement,
      pct: Math.max(0, Math.round((100 - known) * 10) / 10),
      max: false,
      derived: true,
    });
  }

  return {
    id: gradeId(category.slug, grade.name),
    name: grade.name,
    categorySlug: category.slug,
    categoryName: category.name,
    group: category.group,
    properties: category.properties,
    applications: category.applications,
    composition: [...byElement.values()].sort((a, b) => b.pct - a.pct),
    compounds,
    href: `/materials/${category.slug}#${gradeAnchor(grade.name)}`,
  };
}

/** Every grade, flattened and parsed. Built once at module scope. */
export const gradeIndex: IndexedGrade[] = alloyCategories.flatMap((category) =>
  category.grades.map((grade) => indexGrade(category, grade)),
);

export function findGrade(id: string): IndexedGrade | undefined {
  return gradeIndex.find((g) => g.id === id);
}

export const elementNames: Record<string, string> = {
  Ni: "Nickel", Cr: "Chromium", Co: "Cobalt", Mo: "Molybdenum", W: "Tungsten",
  Fe: "Iron", Al: "Aluminium", Ti: "Titanium", Cu: "Copper", Nb: "Niobium",
  C: "Carbon", V: "Vanadium", Mn: "Manganese", Si: "Silicon", B: "Boron",
  Ta: "Tantalum", Zn: "Zinc", Sn: "Tin", Zr: "Zirconium", N: "Nitrogen",
  O: "Oxygen", Be: "Beryllium", Pd: "Palladium",
};

/** Element symbols that actually occur, ordered by how many grades contain them. */
export const elementsInUse: { symbol: string; name: string; count: number }[] = (() => {
  const counts = new Map<string, number>();
  for (const grade of gradeIndex) {
    for (const amount of grade.composition) {
      counts.set(amount.element, (counts.get(amount.element) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([symbol, count]) => ({ symbol, name: elementNames[symbol] ?? symbol, count }))
    .sort((a, b) => b.count - a.count || a.symbol.localeCompare(b.symbol));
})();

/**
 * "High" and "low" cut-offs per element, taken from where the catalogue's own
 * values actually sit rather than from a single global number.
 *
 * Carbon never exceeds a few percent while nickel routinely passes 60, so one
 * shared threshold makes "low carbon" meaningless and "high nickel" trivial.
 * The 70th and 30th percentiles of the grades that contain each element give a
 * cut-off that means something for every column.
 */
export const elementThresholds: ElementThresholds = (() => {
  const byElement = new Map<string, number[]>();
  for (const grade of gradeIndex) {
    for (const amount of grade.composition) {
      byElement.set(amount.element, [...(byElement.get(amount.element) ?? []), amount.pct]);
    }
  }
  const round = (n: number) => Math.round(n * 100) / 100;
  const out: ElementThresholds = {};
  for (const [element, values] of byElement) {
    const sorted = [...values].sort((a, b) => a - b);
    const at = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
    out[element] = { high: round(at(0.7)), low: round(at(0.3)) };
  }
  return out;
})();
