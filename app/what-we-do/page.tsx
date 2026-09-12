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
              {p("Every family in the portfolio, including off-spec grades, mixed lots and off-grade refractory units. We make sure to be able to manage each complex material.")}
            </p>
            <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {portfolioGroups.map((group) => (
                <li key={group.id}>
                  <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">{p(group.name)}</h3>
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
                          <span className="ms-2 font-mono text-[0.6875rem] text-brand-700">{family.threshold}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
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
