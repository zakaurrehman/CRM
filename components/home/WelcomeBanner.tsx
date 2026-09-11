import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getP } from "@/lib/i18n/server";
import { WelcomeBackdrop } from "./WelcomeBackdrop";

/**
 * The welcome block from the original IMS Metals homepage, built the way the
 * original builds it.
 *
 * The original's markup was recovered and read rather than remembered. It is a
 * section with a Ken Burns slideshow for a background, and four widgets sitting
 * directly on it — logo, "WELCOME TO IMS / Metals & Alloys", the objective, a
 * Contact Us button — every one of them entering with Elementor's fadeInLeft,
 * the heading, text and button at the slow setting. There is no card. That is
 * the "effect" IMS kept asking for, and this is the first version to have it.
 *
 * There is no card here either, which is the other thing IMS kept asking for.
 * Every earlier version put a light panel behind the type so that it could be
 * navy; IMS rejected a light panel four times, and never asked for navy — they
 * asked for the logo's typeface, which this uses. So the type is white and the
 * photograph is deepened rather than bleached, which keeps its contrast and its
 * subject: a hot slab still glows, a turbine hall still has depth. The wash is
 * measured, not judged by eye — backdrop-contrast.mjs hides the text, samples
 * the real pixels behind it across every frame, and takes the worst.
 *
 * The logo is the one compromise. IMS's mark has a navy wordmark that would
 * vanish on a dark ground, and the brand pack's reversed version has not been
 * supplied, so the same file is rendered as a white silhouette. Geometry is
 * untouched; only the fill. Swap in the official reversed logo when it arrives.
 *
 * The original's second sentence ("Our long standing and established
 * relationships with suppliers.") is an incomplete fragment on the live site, so
 * only the first, complete sentence is carried over. Nothing is invented: this
 * is the objective statement IMS publishes about itself.
 */
export async function WelcomeBanner() {
  const p = await getP();

  return (
    /* isolate so the backdrop's negative z-index stays inside this section
       rather than sliding behind the page background. */
    <section className="relative isolate overflow-hidden bg-navy-950">
      <WelcomeBackdrop
        slides={[
          { src: "/images/hero/hot-metal-plate.jpg", subject: "Hot metal slab in the cast house" },
          { src: "/images/turbine/turbine-manufacturing.jpg", subject: "Turbine rotor on the shop floor" },
        ]}
      />
      <Container>
        <div className="flex flex-col items-center py-16 text-center sm:py-20 lg:py-24">
          {/*
            Each element enters from the reading-side edge, one after another —
            the original's fadeInLeft, staggered so they arrive as a sequence
            rather than a block. The delays are inline because they differ per
            element and nothing else needs them. welcome-in is defined in
            globals.css, where it also handles right-to-left and reduced motion.
          */}
          <Image
            src="/images/branding/ims-logo.png"
            alt="IMS Metals &amp; Alloys"
            width={1000}
            height={485}
            priority
            sizes="(min-width: 640px) 280px, 220px"
            /* White silhouette of the mark — see the note above. */
            className="welcome-in h-auto w-[11.5rem] brightness-0 invert sm:w-[14.5rem]"
          />

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
          <h1
            className="welcome-in mt-8 font-lockup text-[clamp(1.5rem,3.2vw,2.375rem)] font-black uppercase leading-[1.22] tracking-[-0.005em] text-white"
            style={{ animationDelay: "140ms" }}
          >
            <span className="block">{p("Welcome to IMS")}</span>
            <span className="block">{p("Metals & Alloys")}</span>
          </h1>

          <p
            className="welcome-in mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-[1.0625rem]"
            style={{ animationDelay: "280ms" }}
          >
            {p("Our objective is to responsibly source the commodities which supplement our everyday life.")}
          </p>

          <div className="welcome-in mt-8" style={{ animationDelay: "420ms" }}>
            <Button href="/contact" size="lg">
              {p("Contact us")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
