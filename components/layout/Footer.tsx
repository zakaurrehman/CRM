import { getP } from "@/lib/i18n/server";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNavigation } from "@/lib/navigation";
import { contact, site } from "@/lib/site";

export async function Footer() {
  const p = await getP();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-navy-950 text-steel-300">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-4">
            <Image
              src="/images/branding/ims-logo.png"
              alt="IMS Metals &amp; Alloys"
              width={3000}
              height={1455}
              sizes="200px"
              className="h-12 w-auto opacity-90 brightness-0 invert"
            />
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-steel-400">
              {p("A specialised recycler and supplier to the global nickel refinery, stainless steel, superalloy, titanium and refractory metals industries.")}
            </p>

            <address className="mt-8 not-italic">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-400">{p("Head office")}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel-300">
                {contact.address.street}
                <br />
                {contact.address.city} {contact.address.postalCode}
                <br />
                {contact.address.country}
              </p>
              <a
                href={"mailto:" + contact.email}
                className="mt-3 inline-block rounded-sm text-[0.9375rem] text-white underline decoration-brand-500/60 underline-offset-4 transition-colors hover:decoration-brand-300"
              >
                {contact.email}
              </a>
              {/* No telephone anywhere, by client instruction (2026-09-11).
                  The floating WhatsApp button carries reachability instead, and
                  it puts the number in a link target rather than on the page. */}
            </address>

            {contact.social.length > 0 ? (
              <ul className="mt-7 flex items-center gap-2">
                {contact.social.map((profile) => (
                  <li key={profile.href}>
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={"IMS on " + profile.label}
                      title={profile.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/15 text-steel-300 transition-colors hover:border-white/40 hover:text-white"
                    >
                      <SocialIcon name={profile.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4 lg:gap-8">
            {footerNavigation.map((col) => (
              <nav key={p(col.heading)} aria-label={p(col.heading)}>
                <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-400">
                  {p(col.heading)}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-sm text-[0.9375rem] text-steel-300 transition-colors hover:text-white"
                      >
                        {p(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* The floating WhatsApp button sits over the bottom-right corner and
            covered the last link in this row at 1024px. The reserve is on the
            row rather than the button so the button stays where it is. */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between sm:pe-16">
          <p className="text-[0.8125rem] text-steel-400">
            &copy; {year} {site.legalName}. {p("All rights reserved.")}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem]">
            <Link href="/contact" className="inline-flex min-h-[1.75rem] items-center rounded-sm text-steel-400 transition-colors hover:text-white">
              {p("Contact")}
            </Link>
            <Link href="/materials" className="inline-flex min-h-[1.75rem] items-center rounded-sm text-steel-400 transition-colors hover:text-white">
              {p("Portfolio")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/** Glyphs for the profiles listed in lib/site.ts. */
function SocialIcon({ name }: { name: "linkedin" }) {
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-[1.125rem] w-[1.125rem]" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  return null;
}
