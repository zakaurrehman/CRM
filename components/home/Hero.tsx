import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { companyFacts } from "@/lib/site";

/**
 * Homepage hero.
 *
 * The image is the LCP element, so it is `priority` with an explicit `sizes` of
 * 100vw and no blur placeholder — the overlay already covers the decode gap.
 * Everything above the fold is server-rendered; no JavaScript gates the headline.
 */
export function Hero() {
  return (
    <section className="on-dark relative isolate flex min-h-[38rem] items-end overflow-hidden bg-navy-950 text-white lg:min-h-[44rem]">
      <Image
        src="/images/hero/turnings.jpg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={78}
        className="-z-10 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-navy-950 via-navy-950/88 to-navy-900/55"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-navy-950 to-transparent"
      />

      <Container className="relative">
        <div className="py-20 lg:py-28">
          <p className="eyebrow animate-fade-up text-brand-300">
            Metals &middot; Alloys &middot; Recovery
          </p>

          <h1 className="mt-6 max-w-4xl animate-fade-up text-display-xl text-white [animation-delay:80ms]">
            Advanced metals, alloys and recycling solutions for global industry.
          </h1>

          <p className="mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-steel-300 [animation-delay:160ms] sm:text-xl">
            IMS sources, sorts and certifies high-performance alloys and metal-bearing residues
            arising from the aerospace, oil &amp; gas, industrial gas turbine and stainless steel
            sectors &mdash; returning them to the melt as air-melt or vacuum grade material.
          </p>

          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Button href="/contact" variant="onDark" size="lg">
              Talk to IMS
            </Button>
            <Button href="/materials" variant="onDarkGhost" size="lg">
              Explore materials
            </Button>
          </div>
        </div>

        {/* Specialist metals ticker: concrete and specific, straight from company content. */}
        <div className="animate-fade-up border-t border-white/10 py-5 [animation-delay:320ms]">
          <div className="scroll-x fade-r -mx-5 px-5 sm:mx-0 sm:px-0">
            <ul className="flex w-max items-center gap-6 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-steel-400 sm:w-auto sm:flex-wrap">
              {companyFacts.specialistMetals.map((metal) => (
                <li key={metal} className="whitespace-nowrap">
                  {metal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
