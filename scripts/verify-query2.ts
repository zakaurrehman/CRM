import { gradeIndex, elementThresholds } from "@/lib/alloy-data";
import { parseQuery, matchGrades } from "@/lib/alloy-query";

console.log("thresholds (high/low):");
for (const [el, t] of Object.entries(elementThresholds).slice(0, 10)) {
  console.log(`   ${el.padEnd(4)} high ≥ ${String(t.high).padStart(6)}   low ≤ ${t.low}`);
}

const run = (c: string) => {
  const q = parseQuery(c, elementThresholds);
  const hits = matchGrades(gradeIndex, q, c);
  console.log(`\n"${c}"  ->  ${hits.length} matches`);
  console.log(`   parsed: ${q.explain.join(" · ") || "(none)"}`);
  console.log(`   top   : ${hits.slice(0, 5).map((h) => h.grade.name).join(", ") || "—"}`);
  return hits;
};

const ti = run("titanium");
const lowC = run("low carbon stainless");
run("high nickel corrosion resistant");
run("cobalt free nickel alloy with chromium above 20");

console.log("\n--- assertions ---");
const check = (l: string, p: boolean, d = "") => console.log(`${p ? "PASS" : "FAIL"}  ${l}${d ? "  " + d : ""}`);
check("bare element no longer matches everything", ti.length > 0 && ti.length < gradeIndex.length, `(${ti.length} of ${gradeIndex.length})`);
check("bare 'titanium' returns only Ti-bearing grades", ti.every((h) => h.grade.composition.some((c) => c.element === "Ti")));
check("low carbon uses a carbon-scaled threshold", (elementThresholds.C?.low ?? 99) < 1, `(C low = ${elementThresholds.C?.low})`);
check("low carbon returns only genuinely low-C grades", lowC.every((h) => (h.grade.composition.find((c) => c.element === "C")?.pct ?? 0) <= elementThresholds.C.low), `(${lowC.length} grades)`);
