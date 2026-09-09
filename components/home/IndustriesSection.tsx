import Image from "next/image";
import Link from "next/link";
import { industries } from "@/data/industries";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/** Premium industry cards. Each states the sector, the IMS capability and a route in. */
export function IndustriesSection() {
  return (
    <Section tone="navy">
      <SectionHeader
        eyebrow="Industries served"
        title="Built around the sectors with the tightest specifications."
        description="Aerospace, energy and process industries run alloys at the limit of what the material will take. We work to the specification those sectors demand, in both directions of the supply chain."
        align="split"
        className="[&_h2]:text-white"
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {industries.map((industry, i) => (
          <Reveal key={industry.slug} delay={i * 80}>
            <Link
              href={"/industries/" + industry.slug}
              className="group relative flex min-h-[17rem] sm:min-h-[22rem] flex-col justify-end overflow-hidden rounded-md border border-white/10 p-7 transition-all duration-300 hover:border-white/25 motion-safe:hover:-translate-y-1 lg:min-h-[26rem] lg:p-9"
            >
              <Image
                src={industry.image}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/25 transition-opacity duration-500 group-hover:from-navy-950 group-hover:via-navy-950/70"
              />
              <div className="relative">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-brand-300">
                  {industry.strapline}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  {industry.name}
                </h3>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                  {industry.capabilities.slice(0, 3).map((c) => (
                    <li key={c.title} className="text-[0.8125rem] text-steel-300">
                      {c.title}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-white">
                  Sector capabilities
                  <span aria-hidden className="transition-transform duration-200 ease-swift group-hover:translate-x-1">
                    <span className="dir-arrow">&rarr;</span>
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
