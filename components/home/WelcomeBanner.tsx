import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getP } from "@/lib/i18n/server";
import { WelcomeBackdrop } from "./WelcomeBackdrop";

/**
 * The welcome, as a cinematic industrial opening rather than a card.
 *
 * The opening of the homepage, and the only one. It used to be followed by a
 * separate hero that said the company's message a second time on a second
 * dark band; IMS asked for the two to be one (13 September 2026). So the
 * original's lockup — logo, "WELCOME TO IMS / Metals & Alloys" — now carries
 * the intro's tagline, its one-sentence description and the two doors,
 * where the company objective and "Contact us" used to be. The objective
 * sentence is gone, on IMS's word: it read as generic beside the tagline.
 *
 * What changed before that is the ground and the arrival. There is no panel — the type sits on the photograph, which keeps
 * its own colours under a neutral shade rather than being bleached or tinted,
 * so a hot slab still glows orange and a turbine hall still has depth.
 *
 * The logo keeps its own colours; the heading is white. The logo's navy
 * wordmark would vanish on a dark photograph on its own, so it stands in a
 * soft pool of light instead — see the note at the logo — which is a fix for
 * the mark specifically. The heading has no such problem: white reads cleanly
 * against the photograph at every frame, so it is left alone rather than
 * recoloured to match.
 *
 * The arrival is a sequence, timed so each thing follows the last:
 *
 *   0.0s  the veil lifts off the photograph
 *   0.45s a light slides in from the reading side and settles behind the mark
 *   0.6s  the logo is revealed by a soft-edged sweep, reading-side first
 *   1.1s  the heading, the same sweep
 *   1.75s a rule draws itself under the heading
 *   1.9s  the tagline rises into focus
 *   2.05s the description follows
 *   2.25s the two doors
 *
 * and then the picture drifts — a slow zoom that was already there, and a
 * parallax against the scroll that was not. Nothing loops, nothing sparkles,
 * and there are no particles. Under reduced motion everything is simply there.
 * All of it is CSS; see the welcome block in globals.css, which also handles
 * right-to-left, where every sweep runs the other way.
 *
 * font-lockup is Orbitron standing in for Ethnocentric, the original's face —
 * see app/layout.tsx. Ethnocentric is commercial and IMS has not confirmed a
 * licence; Orbitron is the nearest free face and this is the closest match
 * available without one.
 *
 * The tagline and the description are the company intro's own words.
 */
export async function WelcomeBanner() {
  const p = await getP();

  return (
    /* isolate so the backdrop's negative z-index stays inside this section
       rather than sliding behind the page background. */
    /* steel-950, not navy: this is only seen before the photograph loads,
       and a navy flash would be the one blue thing in a section that has
       none. */
    <section className="relative isolate overflow-hidden bg-steel-950">
      <WelcomeBackdrop
        slides={[
          { src: "/images/hero/hot-metal-plate.jpg", subject: "Hot metal slab in the cast house" },
          { src: "/images/turbine/turbine-manufacturing.jpg", subject: "Turbine rotor on the shop floor" },
        ]}
      />

      <Container>
        <div className="flex min-h-[34rem] flex-col items-center justify-center py-20 text-center sm:min-h-[38rem] lg:min-h-[42rem] lg:py-24">
          {/*
            The mark, in its own colours, standing in light.

            The logo is navy and blue, and its wordmark measures a luminance of
            0.024 — on the dark photograph it would simply vanish, at about
            1.4:1. So a light is placed behind it: a soft, flattened pool that
            slides in from the reading side as the mark is revealed and settles
            there. It is the one bright thing in the frame, which is the point;
            the eye reaches the brand first. Its size is a multiple of the
            logo's, so it scales with it, and its strength is measured rather
            than judged by eye — logo-contrast.mjs hides the mark and samples
            the ground under the wordmark across every frame of the slideshow.

            The light sits outside the masked wrapper. A mask clips everything
            inside it to the element's box, and the light has to spill past the
            edges of the mark to read as light rather than as a panel.
          */}
          <div className="relative">
            <span aria-hidden className="logo-light" />
            <div className="reveal-sweep" style={{ animationDelay: "600ms" }}>
              <Image
                src="/images/branding/ims-logo.png"
                alt="IMS Metals &amp; Alloys"
                width={1000}
                height={485}
                priority
                sizes="(min-width: 640px) 300px, 224px"
                className="h-auto w-[14rem] sm:w-[18.75rem]"
              />
            </div>
          </div>

          {/*
            Two lines, breaking after "IMS", as the original sets it. Each half
            is its own element rather than a <br>: a hard break inside a
            translated string puts the break wherever English happens to want
            it, which is rarely where another language would.

            font-lockup carries no Hebrew, and the stack falls through to the
            display face there, which is why the size is set in a way that suits
            both.
          */}
          <h1
            className="reveal-sweep mt-16 font-lockup text-[clamp(1.625rem,3.4vw,2.625rem)] font-black uppercase leading-[1.2] tracking-[0.01em] text-white"
            style={{ animationDelay: "1100ms" }}
          >
            <span className="block">{p("Welcome to IMS")}</span>
            <span className="block">{p("Metals & Alloys")}</span>
          </h1>

          {/* A rule that draws itself: the one piece of ornament, and it is a
              line. Silver like the type. */}
          <span
            aria-hidden
            className="rule-draw mt-8 h-px w-20 bg-white/40"
            style={{ animationDelay: "1750ms" }}
          />

          {/* The tagline, in the text face rather than the lockup's: the
              lockup is the name, and this is the sentence that follows it.
              A paragraph, not a heading — it is the h1's subtitle, not the
              start of a section. */}
          <p
            className="rise-in mt-8 max-w-3xl text-balance font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold leading-tight tracking-tight text-white"
            style={{ animationDelay: "1900ms" }}
          >
            {p("Turning complex scrap into opportunity.")}
          </p>

          <p
            className="rise-in mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-[1.0625rem]"
            style={{ animationDelay: "2050ms" }}
          >
            {p(
              "IMS Metals & Alloys is a specialised recycler and supplier to the global nickel refinery, stainless steel, superalloy, titanium and refractory metals industries.",
            )}
          </p>

          {/* Two doors, for the two people who arrive here: one has material
              and wants a route for it, the other needs supply. Each opens the
              quotation form with that already answered. */}
          <div
            className="rise-in mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
            style={{ animationDelay: "2250ms" }}
          >
            <Button href="/rfq?direction=sell" size="lg" className="w-full sm:w-auto">
              {p("Offer material")}
            </Button>
            <Button href="/rfq?direction=buy" variant="onDarkGhost" size="lg" className="w-full sm:w-auto">
              {p("Request supply")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
