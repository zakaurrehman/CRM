import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ContactIms } from "@/components/shared/ContactIms";
import { getP } from "@/lib/i18n/server";
import { WelcomeBackdrop } from "./WelcomeBackdrop";

/**
 * The opening of the homepage, as a cinematic industrial opening rather than
 * a card.
 *
 * It used to be followed by a separate hero that said the company's message a
 * second time on a second dark band; IMS asked for the two to be one
 * (13 September 2026), and then for the "WELCOME TO IMS / Metals & Alloys"
 * lockup to go (14 September): the logo already says who this is, so the
 * heading is the message itself — "Turning Complex Scrap into Opportunity."
 * — with the supporting sentence and the one door, an email, under it.
 *
 * The ground and the arrival: there is no panel — the type sits on the photograph, which keeps
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
 *   1.9s  the supporting sentence rises into focus
 *   2.1s  the door
 *
 * and then the picture drifts — a slow zoom that was already there, and a
 * parallax against the scroll that was not. Nothing loops, nothing sparkles,
 * and there are no particles. Under reduced motion everything is simply there.
 * All of it is CSS; see the welcome block in globals.css, which also handles
 * right-to-left, where every sweep runs the other way.
 *
 * The heading is in the headline serif (Instrument Serif, see app/layout.tsx)
 * — the one place on the site that uses it — with the steel sheen. The
 * heading and the sentence are IMS's own words.
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
          /* First, so it is the frame a visitor arrives on and the one that
             holds under reduced motion: cast turbine wheels, the kind of
             superalloy part (713-type) the portfolio leads with. The licensed
             download, supplied by IMS on 14 September 2026, replacing the
             watermarked preview that stood here for a day. */
          { src: "/images/hero/E101X506.jpeg", subject: "Cast turbine wheels" },
          /* Second, on IMS's word (14 September 2026): the turnings — the
             material itself, the form most of it arrives in. */
          { src: "/images/hero/turnings.jpg", subject: "Bright alloy turnings", brightness: 0.55 },
          /* Third, IMS's own photograph (14 September 2026) of a powder lot:
             the other form the material arrives in. Light like the turnings,
             so shaded like them. */
          { src: "/images/hero/powder.jpeg", subject: "Metal powder lot", brightness: 0.55 },
          { src: "/images/hero/hot-metal-plate.jpg", subject: "Hot metal slab in the cast house" },
          { src: "/images/turbine/turbine-manufacturing.jpg", subject: "Turbine rotor on the shop floor" },
        ]}
      />

      <Container>
        <div className="flex min-h-[28rem] flex-col items-center justify-center py-14 text-center sm:min-h-[30rem] lg:min-h-[34rem] lg:py-16">
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

          {/* The message as the heading, in the headline serif, with a faint
              brushed-steel sheen that passes once as it arrives (metal-text,
              in globals.css). text-balance so a two-line break falls evenly
              in every language rather than leaving one word on the second
              line. */}
          <h1
            className="reveal-sweep metal-text mt-10 max-w-4xl text-balance font-headline text-[clamp(2.75rem,6vw,5.25rem)] font-normal leading-[1.02] tracking-[-0.01em] text-white"
            style={{ animationDelay: "1100ms" }}
          >
            {p("Turning Complex Scrap into Opportunity")}
          </h1>

          {/* A rule that draws itself: the one piece of ornament, and it is a
              line. Silver like the type. */}
          <span
            aria-hidden
            className="rule-draw mt-6 h-px w-20 bg-white/40"
            style={{ animationDelay: "1750ms" }}
          />

          <p
            className="rise-in mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/85 sm:text-[1.125rem]"
            style={{ animationDelay: "1900ms" }}
          >
            {p(
              "IMS specialises in complex high-nickel, superalloy, titanium and refractory materials. Through our international processing network, we develop tailored recovery and supply routes that preserve valuable metal content and reduce unnecessary downgrading.",
            )}
          </p>

          {/* One door: an email to IMS, and the address under it (IMS,
              14 September 2026). The two form buttons that stood here came
              off at IMS's request. */}
          <div className="rise-in mt-7 w-full sm:w-auto" style={{ animationDelay: "2100ms" }}>
            <ContactIms tone="dark" align="center" size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
