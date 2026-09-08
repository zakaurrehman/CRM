import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { SavedMaterials } from "@/components/materials/SavedMaterials";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Saved Materials",
  description: "The alloy grades you have saved, ready to compare, export or send through as a quotation request.",
  path: "/materials/saved",
  // The list is held in the reader's browser; there is nothing here to crawl.
  noIndex: true,
});

const trail = [
  { name: "Home", href: "/" },
  { name: "Materials", href: "/materials" },
  { name: "Saved", href: "/materials/saved" },
];

export default function SavedPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="Your shortlist"
        title="Saved materials."
        intro="Grades you have kept while working through the catalogue — compare them, export the data, or send the list straight through for pricing."
        trail={trail}
      />
      <Section tone="light">
        <SavedMaterials />
      </Section>
    </>
  );
}
