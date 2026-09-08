import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { AlloyFinder } from "@/components/materials/AlloyFinder";
import { CtaSection } from "@/components/shared/CtaSection";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import { totalGradeCount, alloyCategoryCount } from "@/data/alloy-index";

export const metadata: Metadata = pageMetadata({
  title: "Alloy Finder — Search by Composition",
  description: `Search ${totalGradeCount} alloy grades by element content, material group or grade name. Filter by chemistry, compare grades side by side and export the data.`,
  path: "/materials/finder",
});

const trail = [
  { name: "Home", href: "/" },
  { name: "Materials", href: "/materials" },
  { name: "Alloy finder", href: "/materials/finder" },
];

export default function FinderPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="Alloy finder"
        title="Find the grade by its chemistry."
        intro={
          <>
            Search {totalGradeCount} grades across {alloyCategoryCount} categories by element content, not just by
            name. Describe the requirement in plain English or set the limits yourself &mdash; the finder shows you
            how it read the query either way.
          </>
        }
        trail={trail}
      />

      <Section tone="light">
        <AlloyFinder />
      </Section>

      <CtaSection secondary={{ href: "/materials", label: "Browse by category" }} />
    </>
  );
}
