/** Exercises the finder's parser against the real catalogue. Each case asserts an interpretation, not just a count. */
import { gradeIndex } from "@/lib/alloy-data";
import { parseQuery, matchGrades } from "@/lib/alloy-query";

const cases = [
  "cobalt free nickel alloy with chromium above 20",
  "high nickel corrosion resistant",
  "Inconel",
  "Ni > 60",
  "Ni>60 and Mo>15",
  "low carbon stainless",
  "contains tantalum",
  "nickel at least 50% no copper",
  "more than 20% chromium",
  "hastelloy",
  "aerospace",
  "titanium",
];

for (const c of cases) {
  const q = parseQuery(c);
  const hits = matchGrades(gradeIndex, q, c);
  console.log(`\n"${c}"`);
  console.log(`   parsed   : ${q.explain.length ? q.explain.join(" · ") : "(no constraints)"}`);
  console.log(`   terms    : [${q.terms.join(", ")}]  groups: [${q.groups.join(", ")}]`);
  console.log(`   matches  : ${hits.length}`);
  console.log(`   top      : ${hits.slice(0, 5).map((h) => h.grade.name).join(", ") || "—"}`);
}

// Correctness spot-checks that must hold, not just "returns something".
console.log("\n--- assertions ---");
const check = (label: string, pass: boolean, detail = "") =>
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  " + detail : ""}`);

const cobaltFree = matchGrades(gradeIndex, parseQuery("cobalt free"), "cobalt free");
check("cobalt free returns no grade containing Co",
  cobaltFree.every((h) => !h.grade.composition.some((c) => c.element === "Co")),
  `(${cobaltFree.length} grades)`);

const niHigh = matchGrades(gradeIndex, parseQuery("Ni > 60"), "Ni > 60");
check("Ni > 60 returns only grades over 60% Ni",
  niHigh.every((h) => (h.grade.composition.find((c) => c.element === "Ni")?.pct ?? 0) > 60),
  `(${niHigh.length} grades)`);

const both = matchGrades(gradeIndex, parseQuery("Ni>60 and Mo>15"), "Ni>60 and Mo>15");
check("two constraints are ANDed, not ORed",
  both.every((h) => {
    const ni = h.grade.composition.find((c) => c.element === "Ni")?.pct ?? 0;
    const mo = h.grade.composition.find((c) => c.element === "Mo")?.pct ?? 0;
    return ni > 60 && mo > 15;
  }) && both.length < niHigh.length,
  `(${both.length} vs ${niHigh.length} for Ni alone)`);

const ta = matchGrades(gradeIndex, parseQuery("contains tantalum"), "contains tantalum");
check("contains tantalum finds Ta only in the Others column too",
  ta.length > 0 && ta.every((h) => h.grade.composition.some((c) => c.element === "Ta")),
  `(${ta.length} grades)`);

const inconel = matchGrades(gradeIndex, parseQuery("Inconel"), "Inconel");
check("plain name search still works",
  inconel.length > 5 && inconel.every((h) => /inconel/i.test(h.grade.name)),
  `(${inconel.length} grades)`);

const empty = matchGrades(gradeIndex, parseQuery("Ni > 99.9"), "Ni > 99.9");
check("an impossible constraint returns nothing", empty.length === 0, `(${empty.length})`);
