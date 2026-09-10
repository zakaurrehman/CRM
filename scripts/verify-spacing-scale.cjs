/**
 * Finds spacing classes whose value is not in the scale, and so emit no CSS.
 *
 * `px-4.5` looks entirely plausible and silently does nothing: Tailwind's
 * default spacing has 0.5, 1.5, 2.5 and 3.5 but no 4.5, and this project's
 * config only adds 13, 18, 22 and 30. There is no error and no warning — the
 * buttons simply lost their horizontal padding.
 *
 * Run with:  node scripts/verify-spacing-scale.cjs
 *
 * Comparing against the scale directly is more reliable than checking the
 * emitted CSS, which needs the selector escaping reproduced exactly (`.` and
 * `:` both take a backslash) and reports false positives the moment that is a
 * character out.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

/** Tailwind's default spacing keys. */
const DEFAULT_SPACING = new Set([
  "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8",
  "9", "10", "11", "12", "14", "16", "20", "24", "28", "32", "36", "40", "44",
  "48", "52", "56", "60", "64", "72", "80", "96",
]);

/** Whatever the project adds on top. */
const config = fs.readFileSync(path.join(ROOT, "tailwind.config.ts"), "utf8");
const extra = new Set();
const spacingBlock = config.match(/spacing:\s*\{([^}]*)\}/);
if (spacingBlock) {
  for (const m of spacingBlock[1].matchAll(/(\d+(?:\.\d+)?)\s*:/g)) extra.add(m[1]);
}

const valid = new Set([...DEFAULT_SPACING, ...extra]);
console.log(`scale: ${DEFAULT_SPACING.size} default + ${extra.size} from config (${[...extra].join(", ")})\n`);

const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
    const rel = `${d}/${e.name}`;
    if (e.isDirectory()) walk(rel);
    else if (/\.tsx?$/.test(e.name)) files.push(rel);
  }
};
walk("app"); walk("components");

/* Utilities that take a spacing value. Arbitrary values in brackets are not
   matched: those are emitted verbatim and cannot fall outside the scale. */
const PATTERN = /(?:^|[\s"'`])(?:[a-z-]+:)*(p|m|gap|space|inset|top|right|bottom|left|start|end)(?:[xytrbl])?-(\d+(?:\.\d+)?)(?=[\s"'`])/g;

const bad = new Map();
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
  for (const m of src.matchAll(PATTERN)) {
    const [full, , value] = m;
    if (valid.has(value)) continue;
    const cls = full.trim();
    if (!bad.has(cls)) bad.set(cls, new Set());
    bad.get(cls).add(rel);
  }
}

if (bad.size === 0) {
  console.log("PASS — every spacing value used is in the scale");
  process.exit(0);
}

console.log("OFF THE SCALE — these generate no CSS and do nothing:\n");
for (const [cls, where] of bad) {
  console.log(`  ${cls}`);
  for (const w of where) console.log(`      ${w}`);
}
process.exit(1);
