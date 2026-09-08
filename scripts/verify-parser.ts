/**
 * Checks the composition parser against all 295 grades.
 *
 * The point is not that it runs — it is that nothing published is silently
 * dropped. Every non-empty source cell must end up either as an element amount,
 * a compound, a balance marker, or a ratio convention. Anything else is a hole.
 */
import { alloyCategories } from "@/data/alloys";
import { parseCell, parseOthers, indexGrade, gradeIndex, elementsInUse } from "@/lib/alloy-data";

let cells = 0;
let accounted = 0;
const unexplained: string[] = [];
const kinds = new Map<string, number>();

for (const category of alloyCategories) {
  for (const grade of category.grades) {
    category.elements.forEach((element, i) => {
      const raw = (grade.values[i] ?? "").trim();
      if (!raw) return;
      cells++;
      if (element === "Others") {
        const { amounts, compounds } = parseOthers(raw);
        const parts = raw.split(",").filter((p) => p.trim()).length;
        if (amounts.length + compounds.length >= parts) accounted++;
        else unexplained.push(`${category.slug}/${grade.name} Others="${raw}" -> ${amounts.length}+${compounds.length} of ${parts}`);
        kinds.set("others", (kinds.get("others") ?? 0) + 1);
        return;
      }
      const cell = parseCell(raw);
      kinds.set(cell.kind, (kinds.get(cell.kind) ?? 0) + 1);
      if (cell.kind === "absent") unexplained.push(`${category.slug}/${grade.name} ${element}="${raw}"`);
      else accounted++;
    });
  }
}

console.log(`source cells with a value : ${cells}`);
console.log(`accounted for             : ${accounted}`);
console.log(`unexplained               : ${unexplained.length}`);
for (const u of unexplained.slice(0, 20)) console.log("   " + u);
console.log("\nkinds:", [...kinds.entries()].map(([k, v]) => `${k}=${v}`).join("  "));

console.log(`\ngrades indexed: ${gradeIndex.length}`);
console.log(`elements in use: ${elementsInUse.length}`);
console.log("  " + elementsInUse.map((e) => `${e.symbol}:${e.count}`).join("  "));

// Spot-check the cases that drove the parser design.
const show = (id: string) => {
  const g = gradeIndex.find((x) => x.id === id);
  if (!g) return console.log(`  MISSING ${id}`);
  console.log(`  ${g.name.padEnd(22)} ${g.composition.map((c) => `${c.element} ${c.pct}${c.max ? "*" : ""}${c.derived ? " (bal)" : ""}`).join(", ")}${g.compounds.length ? "  | compounds: " + g.compounds.join(", ") : ""}`);
};
console.log("\nspot checks:");
show("nickel-alloys:hastelloy-c276");
show("tungsten-alloys:mallory-1000");
show("stainless-steel:aisi-310-hk");
show("tungsten-alloys:tungsten-carbide-s2");
show("nickel-alloys:hastelloy-d");

// Balance arithmetic must reconstruct a sane total.
const balances = gradeIndex.filter((g) => g.composition.some((c) => c.derived));
console.log(`\ngrades with a derived balance: ${balances.length}`);
for (const g of balances) {
  const total = g.composition.filter((c) => !c.max).reduce((s, c) => s + c.pct, 0);
  const flag = total > 101 || total < 90 ? "  <-- CHECK" : "";
  console.log(`  ${g.name.padEnd(24)} nominal total ${total.toFixed(1)}${flag}`);
}
