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

        {/*
          Social sits in the bottom bar rather than at the foot of the first
          column. There it was the only thing below the nav columns, leaving a
          lone icon with the section's whole bottom padding under it and nothing
          beside it — which read as a hole rather than as breathing room.
        */}
        {/* pr on the wide breakpoints keeps this row clear of the floating
            WhatsApp button, which sits over the bottom-right corner and covered
            the social link outright between 768px and 1024px. */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between sm:pr-20">
          <p className="text-[0.8125rem] text-steel-400">
            &copy; {year} {site.legalName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem]">
              <Link href="/contact" className="rounded-sm text-steel-400 transition-colors hover:text-white">
                Contact
              </Link>
              <Link href="/materials" className="rounded-sm text-steel-400 transition-colors hover:text-white">
                Materials
              </Link>
            </div>

            {contact.social.length > 0 ? (
              <ul className="flex items-center gap-2">
                {contact.social.map((profile) => (
                  <li key={profile.href}>
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={"IMS on " + profile.label}
                      title={profile.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-white/15 text-steel-300 transition-colors hover:border-white/40 hover:text-white"
                    >
                      <SocialIcon name={profile.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
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
