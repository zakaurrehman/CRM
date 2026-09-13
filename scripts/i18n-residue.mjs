/**
 * English left behind on a translated page.
 *
 * The coverage report says which keys a locale lacks; it cannot see text that
 * never goes through p() at all. This fetches pages with a locale cookie and
 * lists visible text that still reads as English prose — three or more Latin
 * words in a row that include a common English word. Designations (Inconel
 * 718, Ti-6/4), symbols and the brand name do not trip it.
 *
 * Meaningful for scripts that are not Latin — ru and he. French and Dutch
 * share the alphabet, so for those rely on the coverage report.
 *
 * Usage: node scripts/i18n-residue.mjs <baseUrl> <locale> [<path> ...]
 *   With no paths, checks every page: the sitemap plus the pages left out of it.
 *   Prefer that on Windows: Git Bash rewrites arguments that start with "/"
 *   into Windows paths before Node sees them.
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const [base, locale, ...paths] = process.argv.slice(2);
if (!base || !locale) {
  console.error("usage: node scripts/i18n-residue.mjs <baseUrl> <locale> [<path> ...]");
  process.exit(2);
}
if (paths.length === 0) {
  const crawl = fileURLToPath(new URL("./i18n-crawl.mjs", import.meta.url));
  const listed = execFileSync(process.execPath, [crawl, base, locale, "--list"], { encoding: "utf8" });
  paths.push(...listed.split(/\s+/).filter(Boolean));
}

const COMMON = new Set(
  "the and of to for with we our your in on is are be by from that this it or as at an any all what how who you not can will more see get send request details offer supply open back into have has other".split(" "),
);
const ALLOWED = [/IMS Metals (&|&amp;|and) Alloys( OÜ)?/g, /WELCOME TO IMS/gi, /Metals (&|&amp;) Alloys/gi];

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

let total = 0;
for (const p of paths) {
  const res = await fetch(base + p, { headers: { cookie: `ims_locale=${locale}` } });
  const html = await res.text();
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  const found = new Set();
  const texts = [...body.matchAll(/>([^<>]+)</g)].map((m) => decode(m[1]).trim()).filter(Boolean);
  const attrs = [...body.matchAll(/\s(?:aria-label|placeholder|title|alt)="([^"]+)"/g)].map((m) => decode(m[1]));
  const head = [...html.matchAll(/<title>([^<]+)<\/title>|<meta name="description" content="([^"]+)"/g)].map((m) => decode(m[1] ?? m[2]));
  for (let t of [...texts, ...attrs, ...head]) {
    for (const re of ALLOWED) t = t.replace(re, " ");
    for (const run of t.match(/[A-Za-z][A-Za-z'’-]*(?:[\s,/&–—-]+[A-Za-z][A-Za-z'’-]*){2,}/g) ?? []) {
      const words = run.toLowerCase().split(/[^a-z'’]+/).filter(Boolean);
      if (words.some((w) => COMMON.has(w))) found.add(run.trim());
    }
  }
  if (found.size) {
    total += found.size;
    console.log(`\n${p}  (${res.status})`);
    for (const f of found) console.log("   " + f);
  }
}
console.log(`\n${locale}: ${total} English run(s) across ${paths.length} page(s)`);
