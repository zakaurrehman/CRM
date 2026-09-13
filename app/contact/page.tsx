import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact, routes } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("Contact IMS"),
    description: p("Offer material, request supply, or reach IMS Metals & Alloys OÜ by email or WhatsApp. Registered office in Tallinn, Estonia."),
    path: "/contact",
  });
}

/**
 * Direct communication (IMS, 14 September 2026): the four ways in, each
 * plainly labelled, then the office and a short message form for anything
 * that is not an offer or a supply request.
 */
export default async function ContactPage() {
  const p = await getP();
  const whatsappHref = contact.whatsapp
    ? "https://wa.me/" + contact.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(p(contact.whatsappMessage))
    : null;

  const ways: { title: string; body: string; href: string; label: string; external?: boolean }[] = [
    {
      title: "Offer material",
      body: "Selling complex, mixed or off-spec material to IMS. Attach the analysis and photographs.",
      href: routes.offer,
      label: "Submit material",
    },
    {
      title: "Request supply",
      body: "Buying material from IMS: the grade or chemistry, form, quantity and delivery location.",
      href: routes.supply,
      label: "Request a quote",
    },
    {
      title: "Email IMS",
      body: "For anything else, or to send larger files.",
      href: "mailto:" + contact.email,
      label: contact.email,
    },
    ...(whatsappHref
      ? [{
          title: "Contact IMS on WhatsApp",
          body: "A quick question, or a photograph of a lot from the yard.",
          href: whatsappHref,
          label: "Open WhatsApp",
          external: true,
        }]
      : []),
  ];

  return (
    <>
      <PageHero
        eyebrow={p("Contact")}
        title={p("Contact IMS")}
        intro={p("Four ways to reach us. Offers and supply requests have their own forms, so the right details arrive first time.")}
        trail={trail}
      />

      <Section tone="white">
        <ul className="grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
          {ways.map((way) => (
            <li key={way.title} className="bg-white">
              <div className="flex h-full flex-col p-6">
                <h2 className="font-display text-lg font-medium text-navy-900">{p(way.title)}</h2>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-steel-600">{p(way.body)}</p>
                {way.external ? (
                  <a
                    href={way.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 self-start text-[0.9375rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
                  >
                    <WhatsAppGlyph />
                    {p(way.label)}
                  </a>
                ) : way.href.startsWith("mailto:") ? (
                  <a
                    href={way.href}
                    className="mt-5 self-start break-all text-[0.9375rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
                  >
                    {way.label}
                  </a>
                ) : (
                  <Link
                    href={way.href}
                    className="mt-5 inline-flex h-11 items-center self-start rounded bg-brand-700 px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-brand-800"
                  >
                    {p(way.label)}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="light">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("Send a message")}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-steel-600">
              {p("For anything that is not an offer or a supply request. We reply by email.")}
            </p>
            <div className="mt-10">
              <InquiryForm />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <div className="border-t-2 border-brand-700 bg-white p-7">
                <h2 className="label text-steel-500">{p("Registered office")}</h2>
                <address className="mt-4 not-italic">
                  <p className="text-base font-medium text-navy-900">IMS Metals &amp; Alloys OÜ</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel-600">
                    {contact.address.street}
                    <br />
                    {contact.address.city} {contact.address.postalCode}
                    <br />
                    {contact.address.country}
                  </p>
                  <a
                    href={"mailto:" + contact.email}
                    className="mt-5 inline-block text-[0.9375rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
                  >
                    {contact.email}
                  </a>
                  {/* No telephone by client instruction (2026-09-11). WhatsApp
                      is the voice/chat route instead, and the number reaches
                      wa.me through the link target rather than as page text. */}
                </address>

                {contact.commercialContact ? (
                  <div className="mt-6 border-t border-steel-200 pt-5">
                    <h3 className="label text-steel-500">{p("Commercial contact")}</h3>
                    <p className="mt-2 text-[0.9375rem] font-medium text-navy-900">{contact.commercialContact.name}</p>
                    <p className="text-[0.875rem] text-steel-600">{p(contact.commercialContact.role)}</p>
                    <a
                      href={"mailto:" + contact.commercialContact.email}
                      className="mt-2 inline-block text-[0.9375rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
                    >
                      {contact.commercialContact.email}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Z" />
    </svg>
  );
}
