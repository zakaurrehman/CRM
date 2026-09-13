/**
 * Translation coverage for the phrase tables.
 *
 * Which English strings does the site use, and which does each locale lack?
 * No single source answers that: much of the copy reaches `p()` from data
 * files, so a search of the code misses it, and some text is only drawn after
 * an interaction — a validation error, a search result — so a crawl misses
 * that. This takes the union of three sources:
 *
 *   1. a trace of every key the server looked up during a crawl
 *      (I18N_TRACE=1, see lib/i18n/phrases/index.ts)
 *   2. every literal passed straight to p() in the source
 *   3. strings only shown client-side after interaction: search result
 *      titles, contexts and kinds, and the RFQ and inquiry validation messages
 *
 * Usage (see scripts/README.md for the crawl):
 *   npx tsx scripts/i18n-coverage.ts <trace.log> [--out <dir>]
 *
 * Prints, per locale, how many used strings are missing and how many table
 * entries are orphaned (in no source and no trace). With --out, writes
 * missing-<locale>.json and orphans-<locale>.json.
 */
import fs from "node:fs";
import path from "node:path";
import { ruPhrases } from "@/lib/i18n/phrases/ru";
import { frPhrases } from "@/lib/i18n/phrases/fr";
import { nlPhrases } from "@/lib/i18n/phrases/nl";
import { hePhrases } from "@/lib/i18n/phrases/he";
import { contentFor } from "@/lib/i18n/content";
import { searchIndex, kindLabels, searchSuggestions } from "@/lib/search";
import { alloyCategorySummaries } from "@/data/alloy-index";
import { ferroAlloys, intermediates } from "@/data/portfolio";

const [tracePath, ...rest] = process.argv.slice(2);
if (!tracePath) {
  console.error("usage: npx tsx scripts/i18n-coverage.ts <trace.log> [--out <dir>]");
  process.exit(2);
}
const outIndex = rest.indexOf("--out");
const outDir = outIndex >= 0 ? rest[outIndex + 1] : null;

const used = new Set<string>();

/* 1. Runtime trace. */
for (const line of fs.readFileSync(tracePath, "utf8").split(/\r?\n/)) {
  const at = line.indexOf("[i18n-key] ");
  if (at < 0) continue;
  try {
    used.add(JSON.parse(line.slice(at + "[i18n-key] ".length)));
  } catch {
    /* A log line split by another process's output; the key recurs elsewhere. */
  }
}
const traced = used.size;

/* 2. Literals passed to p(). */
const sourceFiles: string[] = [];
const walk = (dir: string) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full.includes(path.join("lib", "i18n"))) continue;
      walk(full);
    } else if (/\.(tsx?|mjs)$/.test(entry.name)) sourceFiles.push(full);
  }
};
["app", "components", "lib", "data"].forEach(walk);

/**
 * The value of a JS string literal's body. A double-quoted body is already
 * valid JSON; a single-quoted one has its \' unescaped and its bare " escaped
 * so that it becomes one.
 */
const unquote = (quote: string, body: string): string =>
  quote === '"'
    ? JSON.parse(`"${body}"`)
    : JSON.parse(`"${body.replace(/\\'/g, "'").replace(/(^|[^\\])"/g, '$1\\"')}"`);

/* A string literal body: escaped characters, or anything that is not the
   closing quote or a backslash. */
const BODY = String.raw`((?:\\.|(?!\1)[^\\])*)`;

const literalCall = new RegExp(String.raw`\bp\(\s*(["'])` + BODY + String.raw`\1`, "g");
const source = new Map<string, string>();
const literalKeys = new Set<string>();
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  source.set(file, text);
  for (const m of text.matchAll(literalCall)) {
    const key = unquote(m[1], m[2]);
    used.add(key);
    literalKeys.add(key);
  }
}

/* 3. Client-only strings. */
for (const doc of searchIndex) {
  /* A grade title is a designation and never translated; its context is the
     category name, which is. */
  if (doc.kind !== "grade") used.add(doc.title);
  used.add(doc.context);
}
Object.values(kindLabels).forEach((label) => used.add(label));
searchSuggestions.forEach((s) => used.add(s));

/* Validation messages: `errors.field = "..."`, `errors = { lines: { 0: { material: "..." } } }`
   and `e.field = "..."`. Template literals with interpolation are skipped. */
const errorAssignment = new RegExp(
  String.raw`(?:errors(?:\.\w+)?|\be\.\w+)\s*=\s*(?:\{[^"'\x60]*?)?(["'\x60])` + BODY + String.raw`\1`,
  "g",
);
for (const file of ["lib/rfq.ts", "lib/inquiry.ts"]) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(errorAssignment)) {
    if (m[2].includes("${")) continue;
    used.add(unquote(m[1] === "`" ? '"' : m[1], m[2]));
  }
}

/*
 * Keys that are not English sources, and so never belong in a table:
 *   - an already-translated value handed back to p(), such as a localised
 *     breadcrumb or CTA title: text in a non-Latin script, or text that some
 *     table or content pack produces (as a value, or a value with its
 *     placeholders filled in);
 *   - a filled-in template — "Have superalloys to place?" where the source asks
 *     for "Have {nameLower} to place?" — unless the source also asks for that
 *     exact text literally;
 *   - designations, which read the same in every language.
 */
const tables = { ru: ruPhrases, fr: frPhrases, nl: nlPhrases, he: hePhrases };
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const templateOf = (s: string) => new RegExp("^" + s.split(/\{\w+\}/).map(escapeRegExp).join(".+") + "$", "s");
const translatedValues = new Set<string>();
const translatedTemplates: RegExp[] = [];
for (const [locale, table] of Object.entries(tables)) {
  for (const [k, v] of Object.entries(table)) {
    /* A value equal to its key is a pass-through, not a translation; the key
       must still count as a source. */
    if (v === k) continue;
    if (/\{\w+\}/.test(v)) translatedTemplates.push(templateOf(v));
    else translatedValues.add(v);
  }
  const pack = contentFor(locale as keyof typeof tables);
  for (const c of Object.values(pack.categories)) if (c.name) translatedValues.add(c.name);
  for (const a of Object.values(pack.articles)) if (a.title) translatedValues.add(a.title);
  for (const f of Object.values(pack.tungstenForms)) if (f.name) translatedValues.add(f.name);
}
const isTranslated = (key: string) =>
  /[Ѐ-ӿ֐-׿]/.test(key) || translatedValues.has(key) || translatedTemplates.some((t) => t.test(key));
const designations = new Set<string>([
  ...alloyCategorySummaries.flatMap((c) => c.gradeNames),
  ...ferroAlloys.map((a) => a.mark),
  ferroAlloys.map((a) => a.mark).join(", "),
  ...intermediates.flatMap((g) => g.items.map((i) => i.formula ?? "")).filter(Boolean),
  "Inconel 718",
  "Stellite",
  "Densalloy",
  "NbTi",
]);
const templates = [...used].filter((k) => /\{\w+\}/.test(k)).map(templateOf);
const isSource = (key: string) =>
  !designations.has(key) &&
  (literalKeys.has(key) || (!isTranslated(key) && !templates.some((t) => t.test(key))));

/* A key made only of symbols, numbers and designations needs no translation. */
const needsTranslation = (key: string) => /[a-z]{3,}/i.test(key.replace(/\{[^}]+\}/g, ""));
const allSource = [...source.values()].join("\n");

const sources = [...used].filter(isSource);
console.log(
  `strings in use: ${sources.length} English sources (${used.size} looked up, ${traced} from the crawl trace; ` +
    `${used.size - sources.length} set aside as translated values, filled-in templates or designations)`,
);
if (outDir) fs.mkdirSync(outDir, { recursive: true });

for (const [locale, table] of Object.entries(tables)) {
  const missing = sources.filter((k) => needsTranslation(k) && !(k in table)).sort();
  /* Orphaned: not used anywhere we can see, and not present verbatim in the
     source either — so pruning it cannot remove something a code path we did
     not exercise still asks for. */
  const orphans = Object.keys(table)
    .filter((k) => !used.has(k) && !allSource.includes(JSON.stringify(k).slice(1, -1)))
    .sort();
  console.log(`${locale}: ${missing.length} missing, ${orphans.length} orphaned of ${Object.keys(table).length}`);
  if (outDir) {
    fs.writeFileSync(path.join(outDir, `missing-${locale}.json`), JSON.stringify(missing, null, 2));
    fs.writeFileSync(path.join(outDir, `orphans-${locale}.json`), JSON.stringify(orphans, null, 2));
  }
}
