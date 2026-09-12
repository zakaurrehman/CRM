import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { AcceptedForms } from "@/components/shared/AcceptedForms";
import { CtaSection } from "@/components/shared/CtaSection";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { alloyCategorySummaries, totalGradeCount } from "@/data/alloy-index";
import { portfolioFamilies } from "@/data/portfolio";
import { claimedCategorySlugs } from "@/lib/portfolio";
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseCategory } from "@/lib/i18n/content";

const trail = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/materials" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("Portfolio"),
    description: p(
      "High nickel alloys, superalloys, cobalt, FeNiCr, stainless, HSS and tool steel, maraging, titanium, tungsten and moly, niobium, tantalum and hafnium — in solids, turnings, runnings, grindings, 3D powders and dusts.",
    ),
    path: "/materials",
    image: "/images/hero/turnings.jpg",
  });
}

/**
 * The portfolio: the families IMS buys, blends and supplies.
 *
 * The composition tables that used to be this page are now behind each
 * family, and the legacy categories the portfolio does not claim are listed
 * at the foot as reference — still published, no longer the front door.
 */
export default async function PortfolioPage() {
  const p = await getP();
  const locale = await getLocale();
  const reference = alloyCategorySummaries
    .filter((c) => !claimedCategorySlugs.has(c.slug))
    .map((c) => localiseCategory(c, locale));

  return (
    <>
      <PageHero
        eyebrow={p("Portfolio")}
        title={p("What we buy, blend and supply")}
        intro={p("{n} material families, from high nickel alloys to tantalum. Open a family for what we accept, the thresholds that apply, and the published compositions behind it.", { n: portfolioFamilies.length })}
        trail={trail}
        image="/images/hero/turnings.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <PortfolioGrid priority />
      </Section>

      <AcceptedForms />

      <Section tone="light" id="reference">
        <SectionHeader
          eyebrow={p("Grade reference")}
          title={p("Nominal compositions for {n} grades, as published.", { n: totalGradeCount })}
          description={p("The full composition tables are kept for reference: search every grade by element content, or compare up to four side by side. Families in the portfolio carry their tables on their own pages.")}
          align="split"
          action={
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href="/materials/finder">{p("Alloy finder")}</ArrowLink>
              <ArrowLink href="/materials/compare">{p("Compare grades")}</ArrowLink>
            </div>
          }
        />
        {reference.length > 0 ? (
          <div className="mt-12">
            <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
              {p("Other tables")}
            </h3>
            <ul className="mt-4 grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
              {reference.map((category) => (
                <li key={category.slug} className="bg-white">
                  <Link
                    href={"/materials/" + category.slug}
                    className="group flex h-full flex-col p-5 transition-colors hover:bg-steel-50"
                  >
                    <span className="font-display text-[0.9375rem] font-semibold text-navy-900 transition-colors group-hover:text-brand-700">
                      {category.name}
                    </span>
                    <span className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500 tabular-nums">
                      {p("{n} grades", { n: category.gradeCount })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <CtaSection
        title={p("Have something that is not listed?")}
        body={p("The portfolio is what we handle routinely, not the limit of it. Tell us the material and the form and we will confirm whether we can take it.")}
        primary={{ href: "/rfq", label: "Request a quotation" }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
