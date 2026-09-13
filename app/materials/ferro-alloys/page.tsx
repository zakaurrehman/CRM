import type { Metadata } from "next";
import { ferroAlloys, acceptedForms } from "@/data/portfolio";
import { getP } from "@/lib/i18n/server";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ElementMark } from "@/components/portfolio/FamilyCard";
import { CtaSection } from "@/components/shared/CtaSection";
import { ContactIms } from "@/components/shared/ContactIms";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const trail = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/materials" },
  { name: "Ferroalloys", href: "/materials/ferro-alloys" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("Ferroalloys"),
    description: p("FeNiCr, FeW, FeMo, FeNb and FeTi — ferroalloys bought and supplied in all sizes, packings and specifications."),
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
        title={p("Ferroalloys")}
        intro={p("Ferro-nickel-chrome, ferro-tungsten, ferro-molybdenum, ferro-niobium and ferro-titanium — bought and supplied in all sizes, packings and specifications. FeNiCr is the blend developed for refiners, alloy producers and stainless steel mills.")}
        trail={trail}
        tone="dark"
      />

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
                  <ElementMark symbol={alloy.mark} size="lg" />
                  <span className="font-display text-lg font-medium tracking-tight text-navy-900">{p(alloy.name)}</span>
                </Reveal>
              ))}
            </ul>

            <h3 className="mt-10 label text-steel-500">{p("Forms")}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {acceptedForms.map((form) => (
                <li key={form.name} className="rounded-full bg-steel-100 px-3.5 py-1.5 text-[0.875rem] text-navy-900">
                  {p(form.name)}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border-t-2 border-brand-700 bg-steel-50 p-6">
              <h3 className="font-display text-lg font-medium text-navy-900">{p("Buying or selling")}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-steel-600">
                {p("Tell us the alloy, the analysis, the size and packing, and the quantity — offering material or requesting supply.")}
              </p>
              <ContactIms className="mt-6" />
            </div>
          </div>
        </div>
      </Section>

      <CtaSection
        title={p("Have ferroalloys to place?")}
        body={p("The alloy, the analysis, the size and packing, and the quantity are enough to start. We will assess the available route.")}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
