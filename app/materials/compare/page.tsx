import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { CompareTable } from "@/components/materials/CompareTable";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Compare Alloy Grades",
  description:
    "Line up to four alloy grades side by side and compare their nominal composition element by element. Export the comparison or send it through as a quotation request.",
  path: "/materials/compare",
  // The comparison is built from a selection held in the reader's own browser,
  // so there is no stable page for a crawler to index.
  noIndex: true,
});

const trail = [
  { name: "Home", href: "/" },
  { name: "Materials", href: "/materials" },
  { name: "Compare", href: "/materials/compare" },
];

export default function ComparePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="Comparison"
        title="Grades side by side."
        intro="Composition lined up element by element, with the rows that differ marked so the trade-offs are obvious."
        trail={trail}
      />

      <Section tone="light">
        <CompareTable />
      </Section>
    </>
  );
}
