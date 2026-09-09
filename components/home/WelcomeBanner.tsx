import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getP } from "@/lib/i18n/server";

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
    <section className="border-b border-steel-200 bg-white">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center py-16 text-center sm:py-20 lg:py-24">
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
            className="h-auto w-[13.75rem] sm:w-[17.5rem]"
          />

          <h1 className="mt-8 font-display text-[1.75rem] font-semibold uppercase leading-[1.15] tracking-[0.01em] text-navy-900 sm:text-[2.25rem] lg:text-[2.75rem]">
            {p("Welcome to IMS Metals & Alloys")}
          </h1>

          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-steel-700">
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
