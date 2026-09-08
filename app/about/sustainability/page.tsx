import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { recoveryStreams } from "@/data/recovery";

const trail = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Sustainability", href: "/about/sustainability" },
];

export const metadata: Metadata = pageMetadata({
  title: "Sustainability",
  description:
    "Recovering metal units from material destined for landfill, replacing metal that would otherwise originate from primary mining operations.",
  path: "/about/sustainability",
  image: "/images/company/recycling-operations.jpg",
});

const effects = [
  {
    title: "Material diverted from landfill",
    body: "Dusts, filtercakes, sludges and scales are treated as feedstock rather than waste. Our recycling process enables us to revalorise thousands of tons of material destined for landfill every year.",
  },
  {
    title: "Landfill capacity preserved",
    body: "Metal-bearing residues are dense and slow to break down. Diverting them protects valuable landfill space that has no substitute once it is used.",
  },
  {
    title: "Primary mining displaced",
    body: "Recovered units replace metal originating from primary mining operations. A tonne of nickel returned to the melt is a tonne that does not need to be extracted.",
  },
  {
    title: "Circular material flow",
    body: "Sorted, certified reverts go back into their parent alloys, keeping specialist metals in circulation instead of degrading them into lower-value mixed scrap.",
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Sustainability"
        title="Environmental compliance"
        intro="Our unique recycling process enables us to revalorise thousands of tons of material destined for landfill every year. This not only reduces environmental impact and valuable landfill space, but replaces metal units originating from primary mining operations."
        trail={trail}
        image="/images/company/recycling-operations.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <SectionHeader
          eyebrow="Where the benefit is real"
          title="The environmental case is a materials case."
          description="Recovery in this industry is not a gesture. Specialist alloys are expensive to mine and refine, and their value survives service life almost intact — which is precisely why recovering them pays environmentally as well as commercially."
          align="split"
        />

        <ul className="mt-14 grid grid-rule sm:grid-cols-2">
          {effects.map((effect, i) => (
            <Reveal as="li" key={effect.title} delay={i * 70} className="bg-white p-7 lg:p-9">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-700 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-navy-900">
                {effect.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">{effect.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="text-display-sm">What this looks like in practice</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-steel-600">
              We treat {recoveryStreams.length} distinct metal-bearing streams. Each one represents material
              that a producer would otherwise pay to dispose of, carrying metal that a melt shop would
              otherwise buy new.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-steel-600">
              We serve industries by providing environmental compliance alongside innovative, cost-effective
              recycling solutions for stainless steel, soft metallic waste streams, superalloy reverts, high
              temperature alloys and pure metals.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href="/recycling">Recovery capabilities</ArrowLink>
              <ArrowLink href="/recycling/aerospace-reverts">Aerospace reverts</ArrowLink>
            </div>

            <div className="mt-10 border-l-2 border-steel-300 bg-white p-6">
              <p className="text-[0.875rem] leading-relaxed text-steel-600">
                We describe the environmental effect of this business in terms of what it physically does:
                material recovered, landfill avoided, and primary metal displaced. Quantified emissions or
                tonnage figures are provided per contract rather than published as headline claims.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <figure className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/company/port-terminal.jpg"
                alt="Scrap metal transshipment at a port terminal"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover"
              />
              <figcaption className="sr-only">
                Recovered metal moving through international logistics on its way back into production.
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      <CtaSection
        title="Have a stream you are currently paying to dispose of?"
        body="Send us the analysis. If there is recoverable metal in it, we will tell you what it is and what it is worth."
        primary={{ href: "/contact", label: "Discuss a stream" }}
        secondary={{ href: "/recycling", label: "Recovery capabilities" }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
