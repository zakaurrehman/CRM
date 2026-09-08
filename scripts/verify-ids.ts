/** Grade ids key the comparison tray, favourites and RFQ lines, so they must be unique and stable. */
import { gradeIndex } from "@/lib/alloy-data";

const seen = new Map<string, string[]>();
for (const g of gradeIndex) {
  seen.set(g.id, [...(seen.get(g.id) ?? []), `${g.categorySlug}/${g.name}`]);
}
const dupes = [...seen.entries()].filter(([, v]) => v.length > 1);
console.log(`ids: ${seen.size} unique of ${gradeIndex.length} grades`);
console.log(`duplicates: ${dupes.length}`);
for (const [id, names] of dupes) console.log(`   ${id}  <-  ${names.join("  |  ")}`);

const odd = gradeIndex.filter((g) => !/^[a-z0-9-]+:[a-z0-9-]+$/.test(g.id));
console.log(`\nids with unexpected characters: ${odd.length}`);
for (const g of odd.slice(0, 10)) console.log(`   "${g.name}" -> ${g.id}`);

const sample = gradeIndex.find((g) => g.name.includes("310"));
console.log(`\nsample: "${sample?.name}" -> ${sample?.id}`);
