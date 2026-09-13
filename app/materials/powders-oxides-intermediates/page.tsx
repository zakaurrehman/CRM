import type { Metadata } from "next";
import { getP } from "@/lib/i18n/server";
import { intermediates } from "@/data/portfolio";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { Intermediates } from "@/components/portfolio/Intermediates";
import { CtaSection } from "@/components/shared/CtaSection";
import { ContactIms } from "@/components/shared/ContactIms";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/materials" },
  { name: "Powders, Oxides & Intermediates", href: routes.intermediates },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("Powders, Oxides & Intermediates"),
    description: p(
      "APT, YTO, calcium tungstate, tungsten trioxide, molybdenum oxide, tantalum and niobium pentoxide, hafnium dioxide, nickel hydroxide and powders, filter cake and process residues — assessed on contained metal.",
    ),
    path: routes.intermediates,
  });
}

/**
 * The full list of powders, oxides and intermediates, on its own page. The
 * homepage and the portfolio page carry one line and a door to here, so
 * they stay about materials (IMS, 14 September 2026).
 */
export default async function IntermediatesPage() {
  const p = await getP();
  const count = intermediates.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <PageHero
        eyebrow={p("Portfolio")}
        title={p("Powders, Oxides & Intermediates")}
        intro={p("The intermediate products of refining and tool-making that IMS takes alongside scrap — {n} products, grouped by metal, each assessed on its contained metal.", { n: count })}
        trail={trail}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Intermediates />
          </div>
          <div className="lg:col-span-4">
            <div className="border-t-2 border-brand-700 bg-steel-50 p-6 lg:sticky lg:top-28">
              <h3 className="font-display text-lg font-medium text-navy-900">{p("Contact IMS")}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-steel-600">
                {p("Send the product, the analysis, the form and the quantity, with any available assay or COA, and we will assess the available route.")}
              </p>
              <ContactIms className="mt-6" />
            </div>
          </div>
        </div>
      </Section>

      <CtaSection
        title={p("Have powders, oxides or intermediates to place?")}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
