import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getP } from "@/lib/i18n/server";
import { WelcomeBackdrop } from "./WelcomeBackdrop";

/**
 * The welcome block from the original IMS Metals homepage, as a split band.
 *
 * It carries the same content as the original — "WELCOME TO IMS METALS &
 * ALLOYS", the company objective, a Contact Us button — but not the original's
 * arrangement, and the reason is worth recording because it was arrived at the
 * long way round.
 *
 * The original centres that lockup over washed-out photography. Reproducing it
 * meant bleaching the picture far enough for dark type to read over it, which
 * is what IMS kept calling "too light": bleaching flattens an image, and the
 * subject disappears. Darkening it instead and setting the type white fixed the
 * contrast but changed the heading colour, which IMS asked to keep navy. A
 * translucent panel resolved both and introduced a third problem — a card
 * floating on a photograph, covering the part of the photograph worth looking
 * at.
 *
 * Splitting the band settles all three at once. The type sits on its own solid
 * light ground, so it stays navy with nothing washed out to accommodate it, and
 * the photograph runs at full strength with nothing over it at all. The logo is
 * dropped: it is already in the header a hundred pixels above, and printing it
 * twice on one screen weakens it rather than reinforcing it.
 *
 * Alignment, which is the one fiddly part: the text block is `lg:w-1/2` inside
 * the standard Container and the photograph is absolutely positioned over the
 * section's end half. Those meet exactly, at every width and without any calc,
 * because a centred container's content is centred on the viewport — so half of
 * it always ends on the viewport's midline, which is where the photograph
 * starts. `pe-14` then opens the gutter between them.
 *
 * The original's second sentence ("Our long standing and established
 * relationships with suppliers.") is an incomplete fragment on the live site, so
 * only the first, complete sentence is carried over. Nothing is invented: this
 * is the objective statement IMS publishes about itself.
 */
export async function WelcomeBanner() {
  const p = await getP();

  return (
    <section className="relative isolate overflow-hidden bg-steel-50">
      {/*
        The photograph. A strip above the text on a phone, where a split would
        leave two columns too narrow to be either; the end half of the band from
        lg up. Absolutely positioned there, so it bleeds to the edge of the
        viewport rather than stopping at the container gutter, and so the text
        alone sets the band's height.
      */}
      <div className="relative isolate h-56 sm:h-72 lg:absolute lg:inset-y-0 lg:end-0 lg:h-auto lg:w-1/2">
        <WelcomeBackdrop
          slides={[
            { src: "/images/hero/hot-metal-plate.jpg", subject: "Hot metal slab in the cast house" },
            { src: "/images/turbine/turbine-manufacturing.jpg", subject: "Turbine rotor on the shop floor" },
          ]}
        />
      </div>

      <Container>
        <div className="py-12 sm:py-14 lg:w-1/2 lg:pe-14 lg:py-20">
          {/*
            Two lines, breaking after "IMS", as the original sets it. Each half
            is its own element rather than a <br>: a hard break inside a
            translated string puts the break wherever English happens to want
            it, which is rarely where another language would.

            font-lockup is Orbitron standing in for Ethnocentric — see the note
            in app/layout.tsx. It carries no Hebrew, and the stack falls through
            to the display face there, which is why the size is set in a way
            that suits both.
          */}
          <h1 className="font-lockup text-[clamp(1.375rem,2.6vw,2rem)] font-black uppercase leading-[1.22] tracking-[-0.005em] text-navy-900">
            <span className="block">{p("Welcome to IMS")}</span>
            <span className="block">{p("Metals & Alloys")}</span>
          </h1>

          {/* A short rule under the lockup, in the brand blue. The band no
              longer has a panel edge to give the type a frame, so this does
              that job at a fraction of the weight. */}
          <div aria-hidden className="mt-6 h-px w-16 bg-brand-700" />

          <p className="mt-6 max-w-prose text-base leading-relaxed text-steel-700">
            {p("Our objective is to responsibly source the commodities which supplement our everyday life.")}
          </p>

          <div className="mt-8">
            <Button href="/contact" size="lg">
              {p("Contact us")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
