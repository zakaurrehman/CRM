import { getP } from "@/lib/i18n/server";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ContactIms } from "@/components/shared/ContactIms";

/**
 * Closing conversion band: the title, the sentence, and the one door.
 *
 * It closes the homepage, the portfolio and the material pages — the pages
 * about what IMS buys and supplies. The company pages, the grade library and
 * the forms end on their own content.
 */
export async function CtaSection({
  title = "Offer material, or request supply.",
  body = "Selling complex, mixed or off-spec material, or looking for supply: the material, the form and the quantity are enough to start, and we will assess the available route.",
}: {
  title?: string;
  body?: string;
}) {
  const p = await getP();

  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 text-white">
      <Image
        src="/images/company/port-terminal.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-20"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/60" />
      <Container>
        <div className="grid gap-10 py-18 sm:py-22 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-md text-white">{p(title)}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel-300">{p(body)}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <ContactIms tone="dark" size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
