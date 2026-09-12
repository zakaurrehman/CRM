import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { BlendingProgram } from "@/components/shared/BlendingProgram";
import { AcceptedForms } from "@/components/shared/AcceptedForms";
import { Advantage } from "@/components/shared/Advantage";
import { CtaSection } from "@/components/shared/CtaSection";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getP } from "@/lib/i18n/server";
import { customerSectors, portfolioGroups } from "@/data/portfolio";
import { familiesInGroup } from "@/lib/portfolio";

const trail = [
  { name: "Home", href: "/" },
  { name: "What we do", href: "/what-we-do" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("What We Do"),
    description: p(
      "A specialised blending program that transforms complex scrap streams into high-value Ni-based blends — maximising recoverable metal content and reducing downgrading.",
    ),
    path: "/what-we-do",
    image: "/images/hero/turnings.jpg",
  });
}

/**
 * The service, on its own URL. The intro's "Who we are" and "What we do",
 * then the forms accepted, who is supplied, and the five advantages.
 */
export default async function WhatWeDoPage() {
  const p = await getP();

  return (
    <>
      <PageHero
        eyebrow={p("What we do")}
        title={p("Turning complex scrap into opportunity")}
        intro={p(
          "IMS Metals & Alloys OÜ is a specialised recycler and supplier to the global nickel refinery, stainless steel, superalloy, titanium and refractory metals industries. With advanced expertise, we provide tailored blending solutions that create efficiency and cost savings for refiners, alloy producers and the stainless-steel sector.",
        )}
        trail={trail}
        image="/images/hero/turnings.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <SectionHeader
          eyebrow={p("The blending program")}
          title={p("Complex scrap streams in. High-value Ni-based blends out.")}
          description={p("Through our specialised blending program, we transform complex scrap streams into high-value Ni-based blends — maximising recoverable metal content and reducing downgrading.")}
          align="split"
        />
        <div className="mt-14">
          <BlendingProgram />
        </div>

        {/* What "complex" means in practice — the lots conventional routes
            downgrade or turn away. Standard categories in the trade, listed
            at IMS's request for IMS to strike what it does not take. */}
        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h3 className="font-display text-xl font-semibold tracking-tight text-navy-900">{p("Typical lots")}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">
              {p("The material conventional routes downgrade or turn away. If yours is on this list, it has a home.")}
            </p>
          </div>
          <ul className="border-t border-steel-200 lg:col-span-7 lg:col-start-6">
            {[
              "Mixed 718 / 625 / Waspaloy lots",
              "Non-vacuum-grade superalloy turnings",
              "Contaminated or off-spec high-nickel alloys",
              "Dusts, fines and grindings",
              "Mixed titanium and superalloy turnings",
              "Off-grade tungsten, molybdenum, niobium and tantalum units",
              "Hafnium and Ni-Hf materials",
            ].map((lot, i) => (
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
            <p className="mt-5 content-en text-base leading-relaxed text-steel-600">
              {p("Blends are built for the melt they are going into. These are the industries we build them for.")}
            </p>
            <ul className="mt-8 border-t border-steel-200">
              {customerSectors.map((sector, i) => (
                <Reveal as="li" key={sector} delay={i * 50} className="border-b border-steel-200 py-3.5">
                  <span className="font-display text-lg font-semibold tracking-tight text-navy-900">{p(sector)}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-display-sm">{p("What we handle")}</h2>
            <p className="mt-5 content-en text-base leading-relaxed text-steel-600">
              {p("Every material in the portfolio, including off-spec grades, mixed lots and off-grade refractory units. We make sure to be able to manage each complex material.")}
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
                          {family.name}
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
                      {p("Ferro Alloys")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/materials#intermediates" className="text-[0.9375rem] text-navy-900 underline decoration-steel-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700">
                      {p("Powders, Oxides & Intermediaries")}
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

      <Advantage tone="white" />

      <CtaSection />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
