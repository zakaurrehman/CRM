import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getP } from "@/lib/i18n/server";
import { WelcomeBackdrop } from "./WelcomeBackdrop";

/**
 * The welcome, as a cinematic industrial opening rather than a card.
 *
 * Content is the original's, unchanged: logo, "WELCOME TO IMS / Metals &
 * Alloys", the company objective, Contact Us. What changed is the ground and
 * the arrival. There is no panel — the type sits on the photograph, which keeps
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
 *   1.9s  the objective rises into focus
 *   2.15s the button follows
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
 * The original's second sentence ("Our long standing and established
 * relationships with suppliers.") is an incomplete fragment on the live site,
 * so only the first, complete sentence is carried over. Nothing is invented:
 * this is the objective statement IMS publishes about itself.
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

          <p
            className="rise-in mt-8 max-w-xl text-base leading-relaxed text-white/85 sm:text-[1.0625rem]"
            style={{ animationDelay: "1900ms" }}
          >
            {p("Our objective is to responsibly source the commodities which supplement our everyday life.")}
          </p>

          <div className="rise-in mt-9" style={{ animationDelay: "2150ms" }}>
            <Button href="/contact" size="lg">
              {p("Contact us")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
