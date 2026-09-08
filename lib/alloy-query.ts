import type { AlloyGroup } from "@/types/content";
import { normalise } from "./utils";

/**
 * Turns what a buyer types into a composition query.
 *
 * This is the engine behind the alloy finder. It is deliberately a transparent
 * rule-based parser rather than a call out to a language model: it runs offline
 * with no key, no latency and no per-query cost, it cannot hallucinate a grade
 * that IMS does not stock, and — most importantly for a technical audience —
 * every interpretation it makes is reported back through `explain`, so the
 * reader can see that "high nickel" was read as "Ni ≥ 30%" and disagree with it.
 *
 * A metallurgist asking for "cobalt-free corrosion resistant nickel alloy with
 * more than 15% chromium" gets exactly the filter they described. Nothing here
 * guesses at intent it cannot show its working for.
 *
 * No data import: this module is shared by the browser and the server.
 */

export type Comparator = "gte" | "lte" | "gt" | "lt" | "eq";

export interface ElementConstraint {
  element: string;
  op: Comparator;
  value: number;
}

export interface ParsedQuery {
  /** Terms left after the structured parts were consumed; matched against names. */
  terms: string[];
  constraints: ElementConstraint[];
  /** Elements that must not appear at all — "cobalt free", "no copper". */
  absent: string[];
  /** Elements that must appear, at any level — "contains rhenium". */
  present: string[];
  groups: AlloyGroup[];
  /** One line per interpretation, shown to the reader so the parse is auditable. */
  explain: string[];
}

/** Written out so "nickel", "Ni" and "nickle" all resolve to the same column. */
const ELEMENT_LEXICON: Record<string, string> = {
  nickel: "Ni", nickle: "Ni", ni: "Ni",
  chromium: "Cr", chrome: "Cr", cr: "Cr",
  cobalt: "Co", co: "Co",
  molybdenum: "Mo", moly: "Mo", mo: "Mo",
  tungsten: "W", wolfram: "W", w: "W",
  iron: "Fe", fe: "Fe",
  aluminium: "Al", aluminum: "Al", al: "Al",
  titanium: "Ti", ti: "Ti",
  copper: "Cu", cu: "Cu",
  niobium: "Nb", columbium: "Nb", nb: "Nb",
  carbon: "C", c: "C",
  vanadium: "V", v: "V",
  manganese: "Mn", mn: "Mn",
  silicon: "Si", si: "Si",
  boron: "B", b: "B",
  tantalum: "Ta", ta: "Ta",
  zinc: "Zn", zn: "Zn",
  tin: "Sn", sn: "Sn",
  zirconium: "Zr", zr: "Zr",
  nitrogen: "N", n: "N",
  oxygen: "O", o: "O",
  beryllium: "Be", be: "Be",
  palladium: "Pd", pd: "Pd",
};

const GROUP_LEXICON: { match: string[]; group: AlloyGroup }[] = [
  { match: ["nickel alloy", "nickel base", "nickel based", "superalloy"], group: "nickel" },
  { match: ["cobalt alloy", "cobalt base", "cobalt based"], group: "cobalt" },
  { match: ["steel", "ferrous", "stainless", "iron"], group: "ferrous" },
  { match: ["refractory", "reactive", "tungsten alloy", "titanium alloy", "zirconium alloy"], group: "refractory" },
  { match: ["non ferrous", "specialty", "speciality", "copper alloy", "magnet"], group: "non-ferrous" },
];

/**
 * Fallback thresholds for the vague quantifiers.
 *
 * A single pair of numbers across every element is wrong in practice: 5% is a
 * reasonable "low" for chromium and absurd for carbon, which never exceeds a
 * couple of percent in this catalogue. Callers pass `ElementThresholds` derived
 * from the real distribution instead; these only apply when none are supplied.
 * Either way the parse reports the number it used.
 */
const HIGH = 30;
const LOW = 5;

/** Per-element "high"/"low" cut-offs, computed from the catalogue's own spread. */
export type ElementThresholds = Record<string, { high: number; low: number }>;

const COMPARATORS: { tokens: string[]; op: Comparator }[] = [
  { tokens: ["at least", "minimum", "min", ">=", "≥", "over", "more than", "above", "greater than"], op: "gte" },
  { tokens: ["at most", "maximum", "max", "<=", "≤", "under", "less than", "below", "up to"], op: "lte" },
  { tokens: [">"], op: "gt" },
  { tokens: ["<"], op: "lt" },
];

const COMPARATOR_LABEL: Record<Comparator, string> = {
  gte: "≥", lte: "≤", gt: ">", lt: "<", eq: "=",
};

function elementOf(word: string): string | null {
  return ELEMENT_LEXICON[word] ?? null;
}

/**
 * Parses a free-text query.
 *
 * Works on the raw string for the symbolic forms ("Ni>50", "Cr >= 15") because
 * normalising strips the operators, then falls back to word-level scanning for
 * the prose forms ("more than 50% nickel", "cobalt free").
 */
export function parseQuery(input: string, thresholds?: ElementThresholds): ParsedQuery {
  const highOf = (el: string) => thresholds?.[el]?.high ?? HIGH;
  const lowOf = (el: string) => thresholds?.[el]?.low ?? LOW;
  const constraints: ElementConstraint[] = [];
  const absent: string[] = [];
  const present: string[] = [];
  const groups: AlloyGroup[] = [];
  const explain: string[] = [];
  let rest = " " + input.toLowerCase() + " ";

  const consume = (pattern: RegExp, handler: (m: RegExpExecArray) => void) => {
    let match: RegExpExecArray | null;
    // Rebuild after each hit so overlapping forms cannot double-count.
    while ((match = pattern.exec(rest))) {
      handler(match);
      rest = rest.slice(0, match.index) + " " + rest.slice(match.index + match[0].length);
      pattern.lastIndex = 0;
    }
  };

  const names = Object.keys(ELEMENT_LEXICON).sort((a, b) => b.length - a.length);
  const nameAlt = names.join("|");

  // "Ni > 50", "nickel >= 50%", "chromium at least 15"
  const opAlt = COMPARATORS.flatMap((c) => c.tokens)
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  consume(
    new RegExp(`\\b(${nameAlt})\\s*(${opAlt})\\s*(\\d+(?:\\.\\d+)?)\\s*%?`, "g"),
    (m) => {
      const element = elementOf(m[1]);
      const op = COMPARATORS.find((c) => c.tokens.includes(m[2]))?.op ?? "gte";
      if (!element) return;
      constraints.push({ element, op, value: Number(m[3]) });
      explain.push(`${element} ${COMPARATOR_LABEL[op]} ${m[3]}%`);
    },
  );

  // The other way round: "more than 50% nickel", "at least 15 % chromium"
  consume(
    new RegExp(`\\b(${opAlt})\\s*(\\d+(?:\\.\\d+)?)\\s*%?\\s*(${nameAlt})\\b`, "g"),
    (m) => {
      const element = elementOf(m[3]);
      const op = COMPARATORS.find((c) => c.tokens.includes(m[1]))?.op ?? "gte";
      if (!element) return;
      constraints.push({ element, op, value: Number(m[2]) });
      explain.push(`${element} ${COMPARATOR_LABEL[op]} ${m[2]}%`);
    },
  );

  // "cobalt free", "no cobalt", "without cobalt", "cobalt-free"
  consume(new RegExp(`\\b(?:no|without|free of|zero)\\s+(${nameAlt})\\b`, "g"), (m) => {
    const element = elementOf(m[1]);
    if (!element) return;
    absent.push(element);
    explain.push(`no ${element}`);
  });
  consume(new RegExp(`\\b(${nameAlt})[\\s-]*free\\b`, "g"), (m) => {
    const element = elementOf(m[1]);
    if (!element) return;
    absent.push(element);
    explain.push(`no ${element}`);
  });

  // "high nickel", "low carbon"
  consume(new RegExp(`\\bhigh\\s+(${nameAlt})\\b`, "g"), (m) => {
    const element = elementOf(m[1]);
    if (!element) return;
    const value = highOf(element);
    constraints.push({ element, op: "gte", value });
    explain.push(`high ${element} → ${element} ≥ ${value}%`);
  });
  consume(new RegExp(`\\blow\\s+(${nameAlt})\\b`, "g"), (m) => {
    const element = elementOf(m[1]);
    if (!element) return;
    const value = lowOf(element);
    constraints.push({ element, op: "lte", value });
    explain.push(`low ${element} → ${element} ≤ ${value}%`);
  });

  // "contains rhenium", "with tantalum"
  consume(new RegExp(`\\b(?:contains?|containing|with)\\s+(${nameAlt})\\b`, "g"), (m) => {
    const element = elementOf(m[1]);
    if (!element) return;
    present.push(element);
    explain.push(`contains ${element}`);
  });

  const normalisedRest = normalise(rest);
  for (const entry of GROUP_LEXICON) {
    if (entry.match.some((phrase) => normalisedRest.includes(phrase))) {
      if (!groups.includes(entry.group)) groups.push(entry.group);
    }
  }

  /* Whatever survives becomes free text. Element words are kept out of it so
     "nickel alloy" does not also demand the literal string in a grade name. */
  const words = normalisedRest.split(" ").filter(Boolean);
  const terms = words
    .filter((t) => t.length > 1 && !ELEMENT_LEXICON[t])
    .filter((t) => !["high", "low", "free", "no", "with", "contains", "containing", "alloy", "alloys", "and", "for", "the"].includes(t));

  /* A bare element name — "titanium", "tantalum" — carries an obvious intent
     that nothing above has claimed. Without this it contributes no constraint
     and no term, so the query collapses to "match everything". */
  for (const word of words) {
    const element = elementOf(word);
    if (!element) continue;
    const alreadyUsed =
      constraints.some((c) => c.element === element) ||
      absent.includes(element) ||
      present.includes(element);
    if (alreadyUsed) continue;
    present.push(element);
    explain.push(`contains ${element}`);
  }

  return { terms, constraints, absent, present, groups, explain };
}

/** Shape the matcher needs — kept structural so both the server index and the client projection satisfy it. */
export interface QueryableGrade {
  name: string;
  categoryName: string;
  categorySlug: string;
  group: AlloyGroup;
  properties: string[];
  applications: string[];
  composition: { element: string; pct: number; max: boolean }[];
}

function satisfies(amount: { pct: number } | undefined, op: Comparator, value: number): boolean {
  if (!amount) return false;
  switch (op) {
    case "gte": return amount.pct >= value;
    case "lte": return amount.pct <= value;
    case "gt": return amount.pct > value;
    case "lt": return amount.pct < value;
    case "eq": return Math.abs(amount.pct - value) < 0.001;
  }
}

export interface MatchResult<T> {
  grade: T;
  score: number;
  /** Why this grade matched, for display next to the result. */
  reasons: string[];
}

/**
 * Applies a parsed query. Constraints are conjunctive — a technical search that
 * quietly ORs its filters is worse than useless, because the reader cannot tell
 * which results actually meet the spec.
 */
export function matchGrades<T extends QueryableGrade>(
  grades: T[],
  query: ParsedQuery,
  freeText: string,
): MatchResult<T>[] {
  const q = normalise(freeText);
  const out: MatchResult<T>[] = [];

  for (const grade of grades) {
    const byElement = new Map(grade.composition.map((c) => [c.element, c]));
    const reasons: string[] = [];

    let ok = true;
    for (const c of query.constraints) {
      const amount = byElement.get(c.element);
      if (!satisfies(amount, c.op, c.value)) { ok = false; break; }
      reasons.push(`${c.element} ${amount!.pct}%${amount!.max ? " max" : ""}`);
    }
    if (!ok) continue;

    for (const element of query.absent) {
      if (byElement.has(element)) { ok = false; break; }
    }
    if (!ok) continue;

    for (const element of query.present) {
      if (!byElement.has(element)) { ok = false; break; }
      reasons.push(`${element} ${byElement.get(element)!.pct}%`);
    }
    if (!ok) continue;

    if (query.groups.length && !query.groups.includes(grade.group)) continue;

    /* Free text has to match the name, the category or an application. A
       structured-only query (all constraints, no words) matches everything that
       satisfies the constraints, which is the desired behaviour. */
    let textScore = 0;
    if (query.terms.length) {
      const haystack = normalise(
        [grade.name, grade.categoryName, grade.properties.join(" "), grade.applications.join(" ")].join(" "),
      );
      const hit = query.terms.every((t) => haystack.includes(t));
      if (!hit) continue;
      const name = normalise(grade.name);
      textScore = name === q ? 0 : name.startsWith(q) ? 1 : name.includes(q) ? 2 : 3;
    }

    out.push({ grade, score: textScore, reasons });
  }

  out.sort((a, b) => a.score - b.score || a.grade.name.localeCompare(b.grade.name, undefined, { numeric: true }));
  return out;
}

/** Ready-made queries that show what the finder can do without a tutorial. */
export const exampleQueries = [
  "cobalt free nickel alloy with chromium above 20",
  "high nickel corrosion resistant",
  "Inconel",
  "Ni > 60 and Mo > 15",
  "low carbon stainless",
  "contains tantalum",
];
