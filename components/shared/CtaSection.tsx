import { getP } from "@/lib/i18n/server";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { contact, routes } from "@/lib/site";

/**
 * Closing conversion band: the two commercial routes.
 *
 * Not on every page any more (IMS, 14 September 2026): it closes the
 * homepage, the portfolio and the material pages — the pages that are about
 * what IMS buys and supplies. The company pages, the grade library and the
 * forms end on their own content. The default copy names the two routes and
 * promises an assessment, not an acceptance.
 */
export async function CtaSection({
  title = "Offer material, or request supply.",
  body = "Selling complex, mixed or off-spec material, or looking for supply: the material, the form and the quantity are enough to start, and we will assess the available route.",
  primary = { href: routes.offer, label: "Offer material" },
  secondary = { href: routes.supply, label: "Request supply" },
}: {
  title?: string;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
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
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button href={primary.href} variant="onDark" size="lg" className="w-full sm:w-auto lg:w-full">
                {p(primary.label)}
              </Button>
              {secondary ? (
                <Button href={secondary.href} variant="onDarkGhost" size="lg" className="w-full sm:w-auto lg:w-full">
                  {p(secondary.label)}
                </Button>
              ) : null}
            </div>
            <p className="mt-6 text-sm text-steel-400">
              {p("Or email")}{" "}
              <a
                href={"mailto:" + contact.email}
                className="rounded-sm text-white underline decoration-brand-500/60 underline-offset-4 hover:decoration-brand-300"
              >
                {contact.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
