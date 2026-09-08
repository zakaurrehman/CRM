import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { companyFacts } from "@/lib/site";
import { industryBySlug } from "@/data/industries";

const trail = [
  { name: "Home", href: "/" },
  { name: "Recycling", href: "/recycling" },
  { name: "Aerospace Reverts", href: "/recycling/aerospace-reverts" },
];

export const metadata: Metadata = pageMetadata({
  title: "Aerospace Revert Solutions",
  description:
    "Engine teardown, onsite destruction of life-limited parts, superalloy sorting and grading, and precious metal recovery for the aviation industry.",
  path: "/recycling/aerospace-reverts",
  image: "/images/aerospace/aero-engines.jpg",
});

export default function AerospaceRevertsPage() {
  const aerospace = industryBySlug.get("aerospace");

  return (
    <>
      <PageHero
        eyebrow="Recycling & recovery"
        title="Aerospace revert solutions"
        intro="IMS are leading global specialists providing recycling and revert solutions to the aviation and support industry. Led by an experienced team of aviation recycling experts, we offer completely bespoke services built around each customer's material, security and documentation requirements."
        trail={trail}
        image="/images/aerospace/aero-engines.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <SectionHeader
          eyebrow="Services"
          title="A revert route that protects both the alloy and the part record."
          description="Aerospace material carries two kinds of value: the metal itself, and the certainty that a retired part can never return to service. Our services address both."
          align="split"
        />

        <ul className="mt-14 grid grid-rule sm:grid-cols-2">
          {(aerospace?.capabilities ?? []).map((capability, i) => (
            <Reveal as="li" key={capability.title} delay={i * 70} className="bg-white p-7 lg:p-9">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-700 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-navy-900">
                {capability.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">{capability.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="text-display-sm">Precious metal recovery</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-steel-600">
              Aerospace components carry more than their base alloy. Coatings and specialist assemblies
              contain metals worth recovering in their own right, and they are routinely lost when parts are
              treated as bulk scrap.
            </p>
            <ul className="mt-8 grid grid-cols-3 grid-rule">
              {companyFacts.preciousMetalsRecovered.map((metal) => (
                <li key={metal} className="bg-white px-4 py-6 text-center">
                  <span className="font-display text-lg font-semibold text-navy-900">{metal}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.9375rem] leading-relaxed text-steel-600">
              Recovered superalloy returns to the melt as either air-melt or vacuum grade product, sorted
              and graded so it re-enters production as a known specification.{" "}
              <ArrowLink href="/materials/complex-nickel-alloys">Complex nickel alloys</ArrowLink>
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <figure className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/company/scrap-yard.jpg"
                alt="Recovered material staged for sorting and grading"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </Section>

      <CtaSection
        title="Talk to our aviation recycling team."
        body="Engine teardown, onsite destruction, superalloy grading or precious metal recovery — tell us the programme and we will build the service around it."
        primary={{ href: "/contact", label: "Discuss a revert programme" }}
        secondary={{ href: "/industries/aerospace", label: "Aerospace capabilities" }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
