import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StreamsGrid } from "@/components/materials/StreamsGrid";
import { ProcessExplorer } from "@/components/recycling/ProcessExplorer";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { recoveryStreams, processSteps } from "@/data/recovery";
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseProcessStep, localiseStream } from "@/lib/i18n/content";
import { companyFacts } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "Recycling", href: "/recycling" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Metals & Waste Recovery"),
  description:
    p("Metal recovered from 19 industrial residue streams — dusts, powders, filtercakes, scales, sludges and turnings — fine powders through to coarse solids."),
  path: "/recycling",
  image: "/images/company/claw-crane.jpg",
});
}

const capabilities = [
  {
    title: "Fine to coarse",
    body: "Metallurgical and metal-powder processing experience covering material from extremely fine metallic dusts and powders through to coarse solids and turnings.",
  },
  {
    title: "Sorted and segregated",
    body: "Arisings are 100% sorted and segregated so that alloy content is recovered at its true specification rather than downgraded into a mixed stream.",
  },
  {
    title: "Certified output",
    body: "Processed material is certified before it is sold to end customers to be melted back into its parent alloy as air-melt or vacuum grade product.",
  },
  {
    title: "Priced on what we recover",
    body: "Our staff will explain exactly which metals we can recover from your stream, and price against that.",
  },
];

export default async function RecyclingPage() {
  const p = await getP();
  const locale = await getLocale();
  const steps = processSteps.map((s) => localiseProcessStep(s, locale));
  const streams = recoveryStreams.map((s) => localiseStream(s, locale));

  return (
    <>
      <PageHero
        eyebrow={p("Recycling & recovery")}
        title={p("Metals and waste recovery")}
        intro={p("With extensive experience in metallurgical and metal-powder processing, IMS has the expertise to treat materials ranging from extremely fine to coarse metallic dusts and powders. Our staff will explain exactly which metals we can recover from your stream.")}
        trail={trail}
        image="/images/company/claw-crane.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <SectionHeader
          eyebrow={p("What we recover")}
          title={p("Nineteen streams, one route back into production.")}
          description={p("These are the metal-bearing streams we are currently treating. If your material is not listed, it is still worth asking — the list reflects what we handle routinely, not the limit of what we can process.")}
          align="split"
        />
        <div className="mt-12">
          <StreamsGrid allStreams={streams} />
        </div>
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-display-sm">{p("Processing capability")}</h2>
            <p className="mt-5 content-en text-[1.0625rem] leading-relaxed text-steel-600">
              {p("Recovery is a metallurgical problem before it is a logistics one. The value in a filtercake or a plasma dust is only realised if the metal content is identified accurately and separated cleanly.")}
            </p>
            <figure className="relative mt-10 aspect-[4/3] overflow-hidden">
              <Image
                src="/images/company/scrap-yard.jpg"
                alt={p("Metal arisings awaiting sorting and processing")}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="grid grid-rule sm:grid-cols-2">
              {capabilities.map((capability, i) => (
                <Reveal as="li" key={p(capability.title)} delay={i * 70} className="bg-white p-6 lg:p-7">
                  <h3 className="font-display text-base font-semibold text-navy-900">{p(capability.title)}</h3>
                  <p className="mt-2.5 text-[0.875rem] leading-relaxed text-steel-600">{p(capability.body)}</p>
                </Reveal>
              ))}
            </ul>

            <div className="mt-8 bg-white p-6">
              <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                {p("Metals recovered")}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {companyFacts.specialistMetals.map((metal) => (
                  <li key={metal} className="text-[0.9375rem] text-navy-900">
                    {p(metal)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.875rem] text-steel-600">
                {p("Precious metals including {metals} are recovered from aerospace streams.", { metals: companyFacts.preciousMetalsRecovered.map((m) => p(m).toLowerCase()).join(", ") })}{" "}
                <ArrowLink href="/recycling/aerospace-reverts">{p("Aerospace reverts")}</ArrowLink>
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted" id="process">
        <SectionHeader
          eyebrow={p("Recovery process")}
          title={p("How material moves through IMS.")}
          description={p("Every stream follows the same route, whatever form it arrives in. Step through it below — or use the arrow keys.")}
          align="split"
        />
        <div className="mt-14">
          {/* Six steps against real photography of the operation; the two stages
              with no photograph of their own simply render without one. */}
          <ProcessExplorer
            steps={steps}
            images={[
              "/images/company/scrap-yard.jpg",
              undefined,
              "/images/company/claw-crane.jpg",
              "/images/company/recycling-operations.jpg",
              undefined,
              "/images/company/port-terminal.jpg",
            ]}
          />
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Tungsten Recycling",
              body: "Tungsten carbide, Densalloy, CP-W, tungsten powder and heavy metals, in almost all forms of scrap and production waste.",
              href: "/recycling/tungsten",
              image: "/images/tungsten/densalloy.jpg",
            },
            {
              title: "Aerospace Reverts",
              body: "Engine teardown, onsite destruction of life-limited parts, superalloy grading and precious metal recovery.",
              href: "/recycling/aerospace-reverts",
              image: "/images/aerospace/aero-engines.jpg",
            },
            {
              title: "Quality & Compliance",
              body: "Sampling, feed-stock analysis and metallurgical testing behind every certified consignment.",
              href: "/about/quality-and-compliance",
              image: "/images/hero/hot-metal-plate.jpg",
            },
          ].map((card) => (
            <Link key={card.href} href={card.href} className="group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden bg-steel-100">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-swift group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-900 transition-colors group-hover:text-brand-700">
                {p(card.title)}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-steel-600">{p(card.body)}</p>
            </Link>
          ))}
        </div>
      </Section>

      <CtaSection
        title={p("Tell us what is in your waste stream.")}
        body={p("We currently treat {count} distinct streams. Send us the analysis, or a sample, and we will tell you exactly which metals we can recover and what they are worth.", { count: recoveryStreams.length })}
        primary={{ href: "/contact", label: p("Discuss a stream") }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
