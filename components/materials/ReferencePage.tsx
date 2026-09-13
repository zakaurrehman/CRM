import Link from "next/link";
import type { AlloyCategory } from "@/types/content";
import { getP } from "@/lib/i18n/server";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { CompositionTable } from "@/components/materials/CompositionTable";
import { CtaSection } from "@/components/shared/CtaSection";
import { JsonLd, breadcrumbSchema, materialSchema } from "@/lib/schema";

/**
 * A legacy composition table the portfolio does not claim.
 *
 * Seven of the fifteen source categories — nickel copper, cupro-nickels,
 * cobalt iron, alloy irons, nickel iron, magnet alloys, zirconium — are not
 * in the company intro. Their tables stay published at the URL they always
 * had, plainly labelled as reference, and point the reader at the portfolio.
 */
export async function ReferencePage({ category }: { category: AlloyCategory }) {
  const p = await getP();

  const trail = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/materials" },
    { name: "Grade reference", href: "/materials#reference" },
    { name: category.name, href: "/materials/" + category.slug },
  ];

  return (
    <>
      <PageHero eyebrow={p("Grade reference")} title={category.name} intro={category.summary} trail={trail}>
        <p className="max-w-2xl border-s-2 border-steel-300 ps-5 text-[0.9375rem] leading-relaxed text-steel-600">
          {p("This table is kept for reference. The material families IMS currently buys, blends and supplies are on the")}{" "}
          <Link href="/materials" className="text-navy-900 underline decoration-steel-300 underline-offset-4 hover:text-brand-700 hover:decoration-brand-700">
            {p("portfolio page")}
          </Link>
          .
        </p>
      </PageHero>

      <Section tone="light">
        <CompositionTable category={category} />
      </Section>

      <CtaSection
        title={p("Have {nameLower} to place?", { name: category.name, nameLower: category.name.toLowerCase() })}
        body={p("The portfolio is what we handle routinely, not the limit of it. Tell us the material and the form and we will assess whether there is a route for it.")}
        secondary={{ href: "/materials", label: "Back to the portfolio" }}
      />

      <JsonLd
        data={[
          breadcrumbSchema(trail),
          /* No image: the category's stock photograph would read as the
             material, or as stock. */
          materialSchema({
            name: category.name,
            description: category.summary,
            slug: category.slug,
            gradeCount: category.grades.length,
          }),
        ]}
      />
    </>
  );
}
