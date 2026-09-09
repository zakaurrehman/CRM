import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { AlloyFinder } from "@/components/materials/AlloyFinder";
import { CtaSection } from "@/components/shared/CtaSection";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import { totalGradeCount, alloyCategoryCount } from "@/data/alloy-index";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Alloy Finder — Search by Composition"),
  description: p("Search {n} alloy grades by element content, material group or grade name. Filter by chemistry, compare grades side by side and export the data.", { n: totalGradeCount }),
  path: "/materials/finder",
});
}

const trail = [
  { name: "Home", href: "/" },
  { name: "Materials", href: "/materials" },
  { name: "Alloy finder", href: "/materials/finder" },
];

export default async function FinderPage() {
  const p = await getP();
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow={p("Alloy finder")}
        title={p("Find the grade by its chemistry.")}
        intro={
          <>
            {p("Search {grades} grades across {cats} categories by element content, not just by name. Describe the requirement in plain English or set the limits yourself — the finder shows you how it read the query either way.", { grades: totalGradeCount, cats: alloyCategoryCount })}
          </>
        }
        trail={trail}
      />

      <Section tone="light">
        <AlloyFinder />
      </Section>

      <CtaSection secondary={{ href: "/materials", label: p("Browse by category") }} />
    </>
  );
}
