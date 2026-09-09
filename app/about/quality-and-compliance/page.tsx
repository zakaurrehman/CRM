import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const trail = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Quality & Compliance", href: "/about/quality-and-compliance" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Quality & Compliance"),
  description:
    p("Our metallurgical laboratory covers sample receipt, daily feed-stock testing and production analysis, with traceability from source to supply."),
  path: "/about/quality-and-compliance",
  image: "/images/hero/hot-metal-plate.jpg",
});
}

const stages = [
  {
    stage: "Receipt",
    title: "New samples",
    body: "Incoming samples are received and analysed before material is accepted, so a consignment is characterised rather than assumed.",
  },
  {
    stage: "Daily",
    title: "Feed-stock testing",
    body: "Daily feed stock is tested so that what enters processing is a known quantity, and any drift in an incoming stream is caught early.",
  },
  {
    stage: "In-process",
    title: "Production analysis",
    body: "Our production line is analysed as it runs. These results provide essential data to all areas of plant operations, not just the laboratory.",
  },
  {
    stage: "Output",
    title: "Certification",
    body: "Material is certified before it is sold, and the certification travels with it to the customer's melt shop.",
  },
];

export default async function QualityPage() {
  const p = await getP();
  return (
    <>
      <PageHero
        eyebrow={p("Quality & compliance")}
        title={p("Quality control")}
        intro={p("IMS takes pride in our Quality Control metallurgical laboratory. Whether it is receiving new samples, testing daily feed stock or analysing our production line, these results provide essential data to all areas of our plant operations. We work with our customers to ensure that materials are well sampled and tested to their requirement.")}
        trail={trail}
        image="/images/hero/hot-metal-plate.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <SectionHeader
          eyebrow={p("Where testing happens")}
          title={p("Four points of control, not one final check.")}
          description={p("Analysis at a single stage tells you what left the building. Analysis at every stage tells you why.")}
          align="split"
        />

        <ol className="mt-14 grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((item, i) => (
            <Reveal as="li" key={p(item.title)} delay={i * 70} className="bg-white p-7">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-700">{item.stage}</p>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-navy-900">
                {p(item.title)}
              </h3>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-steel-600">{p(item.body)}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="text-display-sm">{p("Traceability")}</h2>
            <p className="mt-5 content-en text-[1.0625rem] leading-relaxed text-steel-600">
              {p("Sorting and segregation are quality controls as much as commercial ones. Keeping alloy families separated through processing means a grade's identity survives the journey, and the certification issued at the end describes material that genuinely matches it.")}
            </p>

            <h2 className="mt-12 text-display-sm">{p("Quality policy")}</h2>
            <p className="mt-5 content-en text-[1.0625rem] leading-relaxed text-steel-600">
              {p("IMS is committed to a policy of continuously improving quality performance throughout the business, to ensure that the highest standards of product and service are achieved.")}
            </p>

            {/* Deliberately not listing scheme accreditations: none were substantiated
                during the content audit. See /docs/content-verification.md. */}
            <div className="mt-10 border-s-2 border-steel-300 bg-white p-6">
              <h3 className="font-display text-base font-semibold text-navy-900">
                {p("Certification for your requirement")}
              </h3>
              <p className="mt-2.5 content-en text-[0.9375rem] leading-relaxed text-steel-600">
                {p("Certification accompanies material supplied by IMS. The specific standards and documentation that apply depend on the material and the contract — ask us for the paperwork relevant to your specification and we will confirm what we can issue.")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <figure className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/metals/steel-rods.jpg"
                alt={p("Stainless steel bar stock staged for inspection")}
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </Section>

      <CtaSection
        title={p("Need documentation for a specification?")}
        body={p("Tell us the grade and the standard you are working to, and we will confirm the testing and certification we can provide against it.")}
        primary={{ href: "/contact", label: "Ask about certification" }}
        secondary={{ href: "/materials", label: p("Explore materials") }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
