import { getP } from "@/lib/i18n/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroSlideshow, type HeroSlide } from "./HeroSlideshow";
import { customerSectors } from "@/data/portfolio";

/**
 * Three frames, in the order the business runs: the scrap as it arrives,
 * the hard material in it, and the melt it goes back to. Only the first is
 * server-rendered — it is the LCP element — and the rest mount after it.
 */
const heroSlides: HeroSlide[] = [
  { src: "/images/hero/turnings.jpg", label: "Alloy turnings" },
  { src: "/images/tungsten/swarf.jpg", label: "Tungsten swarf" },
  { src: "/images/hero/hot-metal-plate.jpg", label: "Back into the melt" },
];

/**
 * Homepage hero.
 *
 * The intro's tagline and its first sentence, then the two things a visitor
 * came to do. The catalogue search that used to lead here is a reference
 * tool now, reached from the portfolio rather than from the front door.
 *
 * Everything above the fold is server-rendered; no JavaScript gates the headline.
 */
export async function Hero() {
  const p = await getP();

  return (
    <section className="group on-dark relative isolate flex min-h-[30rem] items-end overflow-hidden bg-navy-950 text-white lg:min-h-[36rem]">
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
            {p("Specialised recycler & supplier")}
          </p>

          {/* h2, not h1. The welcome block above opens the page and carries the
              h1, as it does on the original site. */}
          <h2 className="mt-6 max-w-4xl animate-fade-up text-display-xl text-white [animation-delay:80ms]">
            {p("Turning complex scrap into opportunity.")}
          </h2>

          <p className="mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-steel-300 [animation-delay:160ms]">
            {p(
              "IMS Metals & Alloys is a specialised recycler and supplier to the global nickel refinery, stainless steel, superalloy, titanium and refractory metals industries.",
            )}
          </p>

          {/* Two doors, for the two people who arrive here: one has material
              and wants a route for it, the other needs supply. Each opens the
              quotation form with that already answered. */}
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Button href="/rfq?direction=sell" variant="onDark" size="lg">
              {p("Offer material")}
            </Button>
            <Button href="/rfq?direction=buy" variant="onDarkGhost" size="lg">
              {p("Request supply")}
            </Button>
          </div>
        </div>

        {/* Who we supply — the intro's five, and nothing else. */}
        <div className="animate-fade-up border-t border-white/10 py-5 [animation-delay:320ms]">
          <div className="scroll-x fade-r -mx-5 px-5 sm:mx-0 sm:px-0">
            <ul className="flex w-max items-center gap-6 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-steel-400 sm:w-auto sm:flex-wrap">
              <li className="whitespace-nowrap text-steel-500">{p("We supply")}</li>
              {customerSectors.map((sector) => (
                <li key={sector} className="whitespace-nowrap">
                  {p(sector)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
