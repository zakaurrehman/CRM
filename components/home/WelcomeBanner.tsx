import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getP } from "@/lib/i18n/server";
import { WelcomeBackdrop } from "./WelcomeBackdrop";

/**
 * The welcome block from the original IMS Metals homepage.
 *
 * The original opens on a centred lockup — logo, "WELCOME TO IMS METALS &
 * ALLOYS", the company objective, and a Contact Us button — before the hero
 * imagery begins. It is the most recognisable thing about the page and the part
 * the client identifies as "the centred logo", so it is reproduced here in the
 * same position and proportions.
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
    <section className="relative isolate overflow-hidden border-b border-steel-200 bg-white">
      <WelcomeBackdrop
        slides={[
          { src: "/images/hero/hot-metal-plate.jpg", subject: "Hot metal slab in the cast house" },
          { src: "/images/turbine/turbine-manufacturing.jpg", subject: "Turbine rotor on the shop floor" },
        ]}
      />
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center py-14 text-center sm:py-16 lg:py-20">
          {/*
            Deliberately larger than the header lockup and not a link: this is
            the brand statement, not a navigation control. The subtle lift on
            hover matches the header's treatment so the two read as the same
            mark rather than two different assets.
          */}
          <Image
            src="/images/branding/ims-logo.png"
            alt="IMS Metals &amp; Alloys"
            width={3000}
            height={1455}
            priority
            sizes="(min-width: 640px) 280px, 220px"
            className="h-auto w-[11.5rem] sm:w-[14.5rem]"
          />

          <h1 className="mt-7 font-display text-[clamp(1.5rem,3.2vw,2.375rem)] font-semibold uppercase leading-[1.15] tracking-[0.005em] text-navy-900">
            {p("Welcome to IMS Metals & Alloys")}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-steel-700">
            {p("Our objective is to responsibly source the commodities which supplement our everyday life.")}
          </p>

          <div className="mt-7">
            <Button href="/contact" size="lg">
              {p("Contact us")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
