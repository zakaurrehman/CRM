/** What actually characterises each category, computed from its own grades. */
import { alloyCategories } from "@/data/alloys";
import { indexGrade } from "@/lib/alloy-data";

for (const category of alloyCategories) {
  const grades = category.grades.map((g) => indexGrade(category, g));
  const stats = new Map<string, number[]>();
  for (const g of grades) for (const c of g.composition) {
    stats.set(c.element, [...(stats.get(c.element) ?? []), c.pct]);
  }
  const profile = [...stats.entries()]
    .map(([element, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      return { element, share: values.length / grades.length, median: sorted[Math.floor(sorted.length / 2)] };
    })
    .filter((e) => e.share >= 0.5)
    .sort((a, b) => b.median - a.median)
    .slice(0, 5);
  console.log(
    category.name.padEnd(24),
    profile.map((p) => `${p.element} ${p.median}`).join("  ").padEnd(46),
    `(${grades.length} grades)`,
  );
}
