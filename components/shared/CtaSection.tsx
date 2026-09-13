import { getP } from "@/lib/i18n/server";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { contact } from "@/lib/site";

/**
 * Closing conversion band.
 *
 * One neutral door (IMS, 14 September 2026): "Contact IMS" opens an email
 * to the general address, and the sentence under it says the address for
 * anyone who would rather copy it. The two form buttons that stood here —
 * Offer material, Request supply — came off at IMS's request; the forms
 * themselves stay reachable from the header, the material pages and the
 * contact page.
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
  const mailto = "mailto:" + contact.email;

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
            <Button href={mailto} variant="onDark" size="lg" className="w-full sm:w-auto lg:w-full">
              {p("Contact IMS")}
            </Button>
            <p className="mt-6 text-sm leading-relaxed text-steel-400">
              {p("For buying, selling and other material enquiries, contact us at")}{" "}
              <a
                href={mailto}
                className="rounded-sm text-white underline decoration-brand-500/60 underline-offset-4 hover:decoration-brand-300"
              >
                {contact.email}
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
