import Link from "next/link";
import Image from "next/image";
import { getP } from "@/lib/i18n/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroSlideshow, type HeroSlide } from "./HeroSlideshow";
import { HeroStage } from "./HeroStage";
import { HeroMotionProvider } from "./HeroMotion";
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
    <section className="group on-dark relative isolate flex min-h-[38rem] items-end overflow-hidden bg-navy-950 text-white lg:min-h-[44rem]">
      <HeroMotionProvider>
      <HeroSlideshow slides={heroSlides} />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-navy-950 via-navy-950/88 to-navy-900/55"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-navy-950 to-transparent"
      />

      <Container className="relative w-full">
        <HeroStage
          intro={
            <>
              <Image
                src="/images/branding/ims-logo.png"
                alt=""
                width={3000}
                height={1455}
                priority
                sizes="(min-width: 640px) 260px, 200px"
                className="h-auto w-[12.5rem] brightness-0 invert sm:w-[16rem]"
              />
              <p className="mt-7 font-display text-[1.5rem] font-semibold uppercase leading-[1.15] tracking-[0.01em] text-white sm:text-[2rem] lg:text-[2.5rem]">
                {p("Welcome to IMS Metals & Alloys")}
              </p>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-steel-300">
                {p("Our objective is to responsibly source the commodities which supplement our everyday life.")}
              </p>
            </>
          }
        >
        <div className="py-20 lg:py-28">
          <p className="eyebrow animate-fade-up text-brand-300">
            {p("Metals · Alloys · Recovery")}
          </p>

          {/* The h1. The welcome lockup that opens over this is decorative and
              transient — it says what the logo's alt text already says — so the
              headline that stays is the one that carries the page's heading. */}
          <h1 className="mt-6 max-w-4xl animate-fade-up text-display-xl text-white [animation-delay:80ms]">
            {p("Advanced metals, alloys and recycling solutions for global industry.")}
          </h1>

          <p className="mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-steel-300 [animation-delay:160ms] sm:text-xl">
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
        </HeroStage>
      </Container>
      </HeroMotionProvider>
    </section>
  );
}
