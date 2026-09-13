import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { BlendingProgramme } from "@/components/shared/BlendingProgramme";
import { AcceptedForms } from "@/components/shared/AcceptedForms";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getP } from "@/lib/i18n/server";
import { customerSectors, portfolioGroups, typicalMaterials } from "@/data/portfolio";
import { familiesInGroup } from "@/lib/portfolio";
import { contact, routes, site } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "What we do", href: "/what-we-do" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("What We Do"),
    description: p(
      "How IMS assesses complex, mixed and off-spec materials and develops recovery, processing and blending routes through an international network of specialist facilities and laboratories.",
    ),
    path: "/what-we-do",
    image: "/images/hero/turnings.jpg",
  });
}

/**
 * How IMS works: the operating model in one paragraph, the programme in
 * three steps, the lots that define the specialisation, the forms, and who
 * is supplied. The advantages and the closing band are the homepage's; this
 * page ends on who it is for (IMS, 14 September 2026: one purpose per page).
 */
export default async function WhatWeDoPage() {
  const p = await getP();

  return (
    <>
      <PageHero
        eyebrow={p("What we do")}
        title={p("How the programme works")}
        intro={p(site.description)}
        trail={trail}
        image="/images/hero/turnings.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <SectionHeader
          eyebrow={p("The blending programme")}
          title={p("A blending programme built around complex materials.")}
          description={p("Through our network of specialist processing facilities, IMS develops and manages tailored nickel-based blends for refiners, alloy producers and stainless steel mills — maximising recoverable metal content and reducing unnecessary downgrading.")}
          align="split"
        />
        <div className="mt-14">
          <BlendingProgramme />
        </div>

        {/* What "complex" means in practice — the lots conventional routes
            downgrade or turn away. IMS's list; the closing line promises an
            assessment, not an acceptance. */}
        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h3 className="font-display text-xl font-medium tracking-tight text-navy-900">{p("Typical materials")}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">
              {p("The material conventional routes downgrade or turn away. If your material matches one of these descriptions, speak with us about the available route.")}
            </p>
            <div className="mt-5">
              <ArrowLink href={"mailto:" + contact.email}>{p("Contact IMS")}</ArrowLink>
            </div>
          </div>
          <ul className="border-t border-steel-200 lg:col-span-7 lg:col-start-6">
            {typicalMaterials.map((lot, i) => (
              <Reveal as="li" key={lot} delay={i * 40} className="border-b border-steel-200 py-3 text-[0.9375rem] font-medium text-navy-900">
                {p(lot)}
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <AcceptedForms />

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-display-sm">{p("Who we supply")}</h2>
            <p className="mt-5 text-base leading-relaxed text-steel-600">
              {p("Blends are built for the melt they are going into. These are the industries we build them for.")}
            </p>
            <ul className="mt-8 border-t border-steel-200">
              {customerSectors.map((sector, i) => (
                <Reveal as="li" key={sector} delay={i * 50} className="border-b border-steel-200 py-3.5">
                  <span className="font-display text-lg font-medium tracking-tight text-navy-900">{p(sector)}</span>
                </Reveal>
              ))}
            </ul>
            <div className="mt-8">
              <ArrowLink href={"mailto:" + contact.email}>{p("Contact IMS")}</ArrowLink>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-display-sm">{p("What we handle")}</h2>
            <p className="mt-5 text-base leading-relaxed text-steel-600">
              {p("Every material in the portfolio, including off-spec grades, mixed lots and off-spec refractory-bearing materials. We assess each complex material and develop the most suitable available route.")}
            </p>
            <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-3">
              {portfolioGroups.map((group) => (
                <li key={group.id}>
                  <h3 className="label text-steel-500">{p(group.name)}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {familiesInGroup(group.id).map((family) => (
                      <li key={family.slug}>
                        <Link
                          href={"/materials/" + family.slug}
                          className="text-[0.9375rem] text-navy-900 underline decoration-steel-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700"
                        >
                          {p(family.name)}
                        </Link>
                        {family.threshold ? (
                          <span className="ms-2 text-[0.75rem] font-medium text-steel-500">{family.threshold}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              <li>
                <h3 className="label text-steel-500">{p("Also")}</h3>
                <ul className="mt-3 space-y-1.5">
                  <li>
                    <Link href="/materials/ferro-alloys" className="text-[0.9375rem] text-navy-900 underline decoration-steel-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700">
                      {p("Ferroalloys")}
                    </Link>
                  </li>
                  <li>
                    <Link href={routes.intermediates} className="text-[0.9375rem] text-navy-900 underline decoration-steel-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700">
                      {p("Powders, Oxides & Intermediates")}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="mt-8">
              <ArrowLink href="/materials">{p("Open the portfolio")}</ArrowLink>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
