import { getP } from "@/lib/i18n/server";
import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    title: "Metals & Alloys",
    body: "Stainless steel, low alloy and die steels, nickel, cobalt, complex nickel superalloys, pure metals and ferro-alloys, supplied against specification.",
    href: "/materials",
    cta: "Browse materials",
    image: "/images/metals/steel-rods.jpg",
  },
  {
    title: "Recycling & Recovery",
    body: "Metallurgical and metal-powder processing for streams ranging from extremely fine dusts and powders through to coarse solids.",
    href: "/recycling",
    cta: "Recovery capabilities",
    image: "/images/company/claw-crane.jpg",
  },
  {
    title: "Aerospace Reverts",
    body: "Engine teardown, onsite destruction of life-limited parts, sorting and grading of superalloys, and precious metal recovery.",
    href: "/recycling/aerospace-reverts",
    cta: "Revert solutions",
    image: "/images/aerospace/aero-engines.jpg",
  },
  {
    title: "Tungsten & Specialty",
    body: "Tungsten carbide, Densalloy, CP-W, tungsten powder and heavy metals, handled in almost all forms of scrap and production waste.",
    href: "/recycling/tungsten",
    cta: "Tungsten recycling",
    image: "/images/tungsten/densalloy.jpg",
  },
];

export async function Pillars() {
  const p = await getP();

  return (
    <Section tone="light">
      <SectionHeader
        eyebrow={p("What IMS does")}
        title={p("Four capabilities, one material chain.")}
        description={p("We operate across the full life of a specialist alloy — supplying prime material, recovering it at end of life, and certifying it back into production.")}
        align="split"
      />

      <div className="mt-14 grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, i) => (
          <Reveal key={p(pillar.title)} delay={i * 80}>
            <Link
              href={pillar.href}
              className="group flex h-full flex-col bg-white transition-colors duration-300 hover:bg-navy-950"
            >
              <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[4/3]">
                <Image
                  src={pillar.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-swift group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-navy-950/25 transition-opacity duration-300 group-hover:opacity-0"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <h3 className="font-display text-xl font-semibold tracking-tight text-navy-900 transition-colors group-hover:text-white">
                  {p(pillar.title)}
                </h3>
                <p className="mt-3 flex-1 content-en text-[0.9375rem] leading-relaxed text-steel-600 transition-colors group-hover:text-steel-300">
                  {p(pillar.body)}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700 transition-colors group-hover:text-brand-300">
                  {p(pillar.cta)}
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
