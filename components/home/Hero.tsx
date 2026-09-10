import Link from "next/link";
import { getP } from "@/lib/i18n/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroSlideshow, type HeroSlide } from "./HeroSlideshow";
import { companyFacts } from "@/lib/site";
import { alloyCategoryCount, totalGradeCount } from "@/data/alloy-index";

/**
 * The backdrop walks through the four sectors the headline names, in the order
 * it names them. Only the first frame is server-rendered — it is the LCP element,
 * so it stays `priority` at 100vw with no blur placeholder, and the rest are
 * mounted after it has loaded. See HeroSlideshow for the rotation itself.
 */
const heroSlides: HeroSlide[] = [
  { src: "/images/hero/turnings.jpg", label: "Alloy turnings" },
  { src: "/images/turbine/turbine-manufacturing.jpg", label: "Industrial gas turbine" },
  { src: "/images/oil-gas/steel-pipes.jpg", label: "Oil and gas" },
  { src: "/images/metals/steel-rods.jpg", label: "Stainless steel" },
];

/**
 * Homepage hero.
 *
 * Everything above the fold is server-rendered; no JavaScript gates the headline.
 */
export async function Hero() {
  const p = await getP();

  return (
    /* `group` so the slideshow controls can stay hidden until the hero is
       hovered — they are a necessary affordance, not part of the picture. */
    <section className="group on-dark relative isolate flex min-h-[32rem] items-end overflow-hidden bg-navy-950 text-white lg:min-h-[38rem]">
      <HeroSlideshow slides={heroSlides} />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-navy-950 via-navy-950/90 to-navy-900/55"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-navy-950 to-transparent"
      />

      <Container className="relative">
        <div className="py-16 lg:py-20">
          <p className="eyebrow animate-fade-up text-brand-300">
            {p("Metals · Alloys · Recovery")}
          </p>

          {/* h2, not h1. The welcome block above opens the page and carries the
              h1, as it does on the original site; two h1s would be one more than
              the page should have, and putting this one first would mean the
              document's headings run h2 before h1. */}
          <h2 className="mt-6 max-w-4xl animate-fade-up text-display-xl text-white [animation-delay:80ms]">
            {p("Advanced metals, alloys and recycling solutions for global industry.")}
          </h2>

          <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-steel-300 [animation-delay:160ms]">
            {p(
              "IMS sources, sorts and certifies high-performance alloys and metal-bearing residues arising from the aerospace, oil & gas, industrial gas turbine and stainless steel sectors — returning them to the melt as air-melt or vacuum grade material.",
            )}
          </p>

          {/* The catalogue is the reason to be here, so it leads. "Talk to IMS"
              stays reachable from the header on every page. */}
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Button href="/materials/finder" variant="onDark" size="lg">
              {p("Search {count} alloy grades", { count: totalGradeCount })}
            </Button>
            <Button href="/rfq" variant="onDarkGhost" size="lg">
              {p("Request a quotation")}
            </Button>
          </div>

          <p className="mt-6 animate-fade-up text-[0.875rem] text-steel-400 [animation-delay:280ms]">
            {p("Search by composition — “cobalt free, chromium above 20” — or")}{" "}
            <Link href="/materials" className="text-steel-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
              {p("browse all {count} categories", { count: alloyCategoryCount })}
            </Link>
            .
          </p>
        </div>

        {/* Specialist metals ticker: concrete and specific, straight from company content. */}
        <div className="animate-fade-up border-t border-white/10 py-5 [animation-delay:320ms]">
          <div className="scroll-x fade-r -mx-5 px-5 sm:mx-0 sm:px-0">
            <ul className="flex w-max items-center gap-6 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-steel-400 sm:w-auto sm:flex-wrap">
              {companyFacts.specialistMetals.map((metal) => (
                <li key={p(metal)} className="whitespace-nowrap">
                  {p(metal)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
