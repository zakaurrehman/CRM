import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { MaterialsBrowser } from "@/components/materials/MaterialsBrowser";
import { categoryProfiles } from "@/lib/alloy-profile";
import { CtaSection } from "@/components/shared/CtaSection";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { alloyCategorySummaries, alloyCategoryCount, totalGradeCount } from "@/data/alloy-index";
import { companyFacts } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "Materials", href: "/materials" },
];

export const metadata: Metadata = pageMetadata({
  title: "Metals & Alloys",
  description: `${totalGradeCount} alloy grades across ${alloyCategoryCount} categories — nickel, cobalt, stainless, tool steels, titanium, tungsten and zirconium — with nominal composition data.`,
  path: "/materials",
  image: "/images/metals/steel-rods.jpg",
});

const specimenProfiles = Object.fromEntries(
  alloyCategorySummaries
    .filter((c) => c.cardArt === "specimen")
    .map((c) => [c.slug, categoryProfiles[c.slug] ?? []]),
);

export default function MaterialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Metals & alloys"
        title="Materials directory"
        intro={
          <>
            {totalGradeCount} alloy grades across {alloyCategoryCount} categories, each with the nominal
            composition published against it. Search by grade name, filter by material group, or open a
            category for the full composition table.
          </>
        }
        trail={trail}
        image="/images/metals/steel-rods.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <MaterialsBrowser categories={alloyCategorySummaries} profiles={specimenProfiles} />
      </Section>

      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-display-sm">Beyond the directory</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-steel-600">
              The categories above cover the alloy families we document publicly. We also handle pure
              metals and a full range of ferro-alloys in all sizes, packings and specifications.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                  Ferro-alloys
                </h3>
                <ul className="mt-4 space-y-2">
                  {companyFacts.ferroAlloys.map((fa) => (
                    <li key={fa} className="font-mono text-[0.9375rem] text-navy-900">
                      {fa}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                  Specialist metals
                </h3>
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  {companyFacts.specialistMetals.map((metal) => (
                    <li key={metal} className="text-[0.9375rem] text-navy-900">
                      {metal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <CtaSection
        title="Looking for a grade that is not listed?"
        body="The directory reflects the alloy families we publish composition data for. Tell us the specification you need and we will confirm whether we can source or recover it."
        primary={{ href: "/contact", label: "Ask about a material" }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
