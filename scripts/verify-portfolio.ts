/**
 * The portfolio layer over the composition tables.
 *
 * Every legacy category is either claimed by exactly one family (or split
 * between families by an explicit grade list) or listed as reference; no
 * grade is lost in the split; every grade link resolves to a page that will
 * actually contain that grade's anchor; and the search index carries every
 * family. Run with `npx tsx scripts/verify-portfolio.ts`.
 */
import { alloyCategories } from "@/data/alloys";
import { portfolioFamilies, MAX_FAMILY_IMAGES } from "@/data/portfolio";
import { claimedCategorySlugs, familyForCategory, familyBySlug } from "@/lib/portfolio";
import { gradeIndex } from "@/lib/alloy-data";
import { tablesFor } from "@/components/portfolio/FamilyPage";
import { searchIndex } from "@/lib/search";

let failures = 0;
const check = (ok: boolean, label: string, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? "  " + detail : ""}`);
  if (!ok) failures++;
};

/* Every table reference points at a real category. */
for (const f of portfolioFamilies) {
  for (const t of f.tables) {
    check(alloyCategories.some((c) => c.slug === t.category), `${f.slug}: table "${t.category}" exists`);
  }
  check(f.images.length <= MAX_FAMILY_IMAGES, `${f.slug}: at most ${MAX_FAMILY_IMAGES} images`, `(${f.images.length})`);
}

/* A split category's grades are all accounted for, once. */
for (const c of alloyCategories) {
  if (!claimedCategorySlugs.has(c.slug)) continue;
  const shown = portfolioFamilies.flatMap((f) => tablesFor(f, "en").filter((t) => t.slug === c.slug).flatMap((t) => t.grades.map((g) => g.name)));
  const unique = new Set(shown);
  check(unique.size === c.grades.length && shown.length === c.grades.length, `${c.slug}: ${c.grades.length} grades shown exactly once across families`, `(${shown.length} shown, ${unique.size} unique)`);
}

/* Every grade link lands on a page that renders that grade. */
let bad = 0;
for (const g of gradeIndex) {
  const [path] = g.href.split("#");
  const slug = path.replace("/materials/", "");
  const family = familyBySlug.get(slug);
  const ok = family
    ? tablesFor(family, "en").some((t) => t.grades.some((x) => x.name === g.name))
    : !claimedCategorySlugs.has(slug) && slug === g.categorySlug;
  if (!ok) { bad++; if (bad <= 5) console.log("      broken:", g.name, "->", g.href); }
}
check(bad === 0, `all ${gradeIndex.length} grade links resolve`, bad ? `(${bad} broken)` : "");

/* The Maraging split in particular. */
check(familyForCategory("complex-nickel-alloys", "MARAGING 250")?.slug === "maraging-steel", "MARAGING 250 -> maraging-steel");
check(familyForCategory("complex-nickel-alloys", "Waspaloy")?.slug === "superalloys", "Waspaloy -> superalloys");
check(familyForCategory("complex-nickel-alloys")?.slug === "superalloys", "bare complex-nickel-alloys -> superalloys");
check(familyForCategory("nickel-copper") === undefined, "nickel-copper is reference, not a family");

/* Search carries every family. */
for (const f of portfolioFamilies) {
  check(searchIndex.some((d) => d.kind === "family" && d.href === `/materials/${f.slug}`), `search indexes ${f.slug}`);
}

console.log(failures ? `\n${failures} failure(s)` : "\nall checks passed");
process.exit(failures ? 1 : 0);
