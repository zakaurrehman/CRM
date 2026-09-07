import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNavigation } from "@/lib/navigation";
import { contact, site } from "@/lib/site";

export function Footer() {
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
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-steel-400">
              Sourcing, processing and certifying metals, alloys and metal-bearing residues for the
              aerospace, oil &amp; gas, industrial gas turbine and stainless steel industries.
            </p>

            <address className="mt-8 not-italic">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-400">Head office</p>
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
              {/* Telephone intentionally omitted until a verified number replaces the
                  placeholder published on the legacy site. See lib/site.ts. */}
              {contact.phone ? (
                <a href={"tel:" + contact.phone.replace(/\s/g, "")} className="mt-1 block text-[0.9375rem] text-white">
                  {contact.phone}
                </a>
              ) : null}
            </address>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4 lg:gap-8">
            {footerNavigation.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-400">
                  {col.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-sm text-[0.9375rem] text-steel-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-steel-400">
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem]">
            <Link href="/contact" className="rounded-sm text-steel-400 transition-colors hover:text-white">
              Contact
            </Link>
            <Link href="/materials" className="rounded-sm text-steel-400 transition-colors hover:text-white">
              Materials
            </Link>
            {contact.social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                rel="noopener noreferrer"
                target="_blank"
                className="rounded-sm text-steel-400 transition-colors hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
