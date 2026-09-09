/**
 * Fails if data/alloy-index.ts has drifted from data/alloys.ts.
 *
 * The index is a slim companion to the full dataset, generated from it once and
 * committed — there is no generator in the repo. That is a quiet trap: editing
 * a category's image in alloys.ts changes its detail page while the card grid,
 * which reads the index, keeps the old one. That is exactly how the materials
 * directory ended up showing a photograph of ferrous billet ends against
 * Nickel Alloys after the assignment had already been corrected.
 *
 * Run with:  npx tsx scripts/verify-alloy-index.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

/** The fields both files carry for a category, keyed by slug. */
type Shared = { name: string; image: string; cardArt: string };

function readShared(relativePath: string): Map<string, Shared> {
  const text = readFileSync(join(ROOT, relativePath), "utf8");
  const found = new Map<string, Shared>();

  // Each category block runs from its slug to the next one.
  const slugPositions: { slug: string; at: number }[] = [];
  for (const m of text.matchAll(/slug:\s*"([a-z0-9-]+)"/g)) {
    slugPositions.push({ slug: m[1], at: m.index! });
  }

  for (const [i, { slug, at }] of slugPositions.entries()) {
    const end = i + 1 < slugPositions.length ? slugPositions[i + 1].at : text.length;
    const block = text.slice(at, end);

    const name = block.match(/name:\s*"([^"]+)"/)?.[1];
    const image = block.match(/image:\s*"([^"]+)"/)?.[1];
    const cardArt = block.match(/cardArt:\s*"(\w+)"/)?.[1];
    if (!name || !image || !cardArt) continue; // grade entries, not categories

    const existing = found.get(slug);
    const record = { name, image, cardArt };
    if (existing && JSON.stringify(existing) !== JSON.stringify(record)) {
      console.error(`  ${relativePath} disagrees with itself about "${slug}"`);
      process.exitCode = 1;
    }
    found.set(slug, record);
  }

  return found;
}

const alloys = readShared("data/alloys.ts");
const index = readShared("data/alloy-index.ts");

let problems = 0;

for (const [slug, source] of alloys) {
  const copy = index.get(slug);
  if (!copy) {
    console.error(`  missing from alloy-index.ts: ${slug}`);
    problems++;
    continue;
  }
  for (const field of ["name", "image", "cardArt"] as const) {
    if (source[field] !== copy[field]) {
      console.error(`  ${slug}.${field}`);
      console.error(`      alloys.ts      ${source[field]}`);
      console.error(`      alloy-index.ts ${copy[field]}`);
      problems++;
    }
  }
}

for (const slug of index.keys()) {
  if (!alloys.has(slug)) {
    console.error(`  in alloy-index.ts but not alloys.ts: ${slug}`);
    problems++;
  }
}

if (problems > 0) {
  console.error(`\n${problems} mismatch(es). Update data/alloy-index.ts to match data/alloys.ts.`);
  process.exit(1);
}

console.log(`alloy-index.ts matches alloys.ts across ${alloys.size} categories`);

// A photograph standing in for more than one material is the thing this whole
// assignment exists to prevent, so it is worth failing on too.
const photos = new Map<string, string[]>();
for (const [slug, { image, cardArt }] of alloys) {
  if (cardArt !== "photo") continue;
  photos.set(image, [...(photos.get(image) ?? []), slug]);
}
const shared = [...photos].filter(([, slugs]) => slugs.length > 1);
if (shared.length > 0) {
  for (const [image, slugs] of shared) {
    console.error(`  ${image} is used by ${slugs.length} categories: ${slugs.join(", ")}`);
  }
  console.error("\nEach photographed category needs an image that depicts it.");
  process.exit(1);
}

console.log(`${photos.size} photographs, each used by exactly one category`);
