import type { Metadata } from "next";
import { ferroAlloys, acceptedForms } from "@/data/portfolio";
import { getP } from "@/lib/i18n/server";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SymbolBox } from "@/components/portfolio/FamilyCard";
import { CtaSection } from "@/components/shared/CtaSection";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/materials" },
  { name: "Ferro Alloys", href: "/materials/ferro-alloys" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("Ferro Alloys"),
    description: p("FeNiCr, FeW, FeMo, FeNb and FeTi — ferro-alloys bought and supplied in all sizes, packings and specifications."),
    path: "/materials/ferro-alloys",
    image: "/images/hero/hot-metal-plate.jpg",
  });
}

/** The five ferro-alloys on one page: formula, name, and the way to ask. */
export default async function FerroAlloysPage() {
  const p = await getP();

  return (
    <>
      <PageHero
        eyebrow={p("Portfolio")}
        title={p("Ferro Alloys")}
        intro={p("Ferro-nickel-chrome, ferro-tungsten, ferro-molybdenum, ferro-niobium and ferro-titanium — available in all sizes, packings and specifications. FeNiCr is the blend we build for refiners, alloy producers and the stainless-steel sector.")}
        trail={trail}
        image="/images/hero/hot-metal-plate.jpg"
        imageAlt=""
      >
        <Button href="/rfq" variant="onDark" size="lg">
          {p("Request a quotation")}
        </Button>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("What we handle")}</h2>
            <ul className="mt-8 border-t border-steel-200">
              {ferroAlloys.map((alloy, i) => (
                <Reveal
                  as="li"
                  key={alloy.mark}
                  id={alloy.mark.toLowerCase()}
                  delay={i * 50}
                  className="flex items-center gap-5 border-b border-steel-200 py-4"
                >
                  <SymbolBox symbol={alloy.mark} size="lg" />
                  <span className="font-display text-lg font-semibold tracking-tight text-navy-900">{p(alloy.name)}</span>
                </Reveal>
              ))}
            </ul>

            <h3 className="mt-10 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">{p("Forms")}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {acceptedForms.map((form) => (
                <li key={form.name} className="rounded-sm border border-steel-300 px-3 py-1.5 text-[0.875rem] text-navy-900">
                  {p(form.name)}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border-t-2 border-brand-700 bg-steel-50 p-6">
              <h3 className="font-display text-lg font-semibold text-navy-900">{p("Get a price")}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-steel-600">
                {p("Tell us the alloy, the analysis, the size and packing, and the quantity — buying or selling.")}
              </p>
              <div className="mt-6">
                <Button href="/rfq" variant="primary" className="w-full">
                  {p("Request a quotation")}
                </Button>
              </div>
              <p className="mt-4 text-[0.8125rem] text-steel-500">
                {p("Or email")}{" "}
                <a href={"mailto:" + contact.email} className="text-navy-900 underline decoration-steel-300 underline-offset-4 hover:decoration-brand-700">
                  {contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Section>

      <CtaSection
        title={p("Have ferro-alloys to place?")}
        secondary={{ href: "/materials", label: p("Back to the portfolio") }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
