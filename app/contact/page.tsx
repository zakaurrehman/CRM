import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/lib/site";
import { portfolioFamilies } from "@/data/portfolio";

const trail = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Contact IMS"),
  description:
    p("Talk to IMS Metals & Alloys OÜ about complex scrap, off-spec grades and Ni-based blends. Head office in Tallinn, Estonia."),
  path: "/contact",
});
}

/* The intro's three audiences, in its words. */
const routes = [
  {
    title: "Selling complex scrap",
    body: "Off-spec grades, mixed lots and off-grade refractory units, in solids, turnings, runnings, grindings, 3D powders or dusts.",
  },
  {
    title: "Buying a blend",
    body: "Tailored Ni-based blends for refiners, alloy producers and the stainless-steel sector, built to your melt.",
  },
  {
    title: "Refractory and rare metals",
    body: "Tungsten and moly from 8% content, niobium and tantalum from 10%, hafnium and Ni-Hf master alloys.",
  },
];

export default async function ContactPage() {
  const p = await getP();
  return (
    <>
      <PageHero
        eyebrow={p("Contact")}
        title={p("Talk to IMS")}
        intro={p("Tell us the material, the form and the quantity, and we will come back with a route for it.")}
        trail={trail}
      />

      <Section tone="white">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("Request an inquiry")}</h2>
            <p className="mt-4 max-w-xl content-en text-base leading-relaxed text-steel-600">
              {p("The more you can tell us about the material, the faster we can come back with something useful.")}
            </p>
            <div className="mt-10">
              <InquiryForm materialNames={portfolioFamilies.map((f) => f.name)} />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <div className="border-t-2 border-brand-700 bg-steel-50 p-7">
                <h2 className="label text-steel-500">
                  {p("Head office")}
                </h2>
                <address className="mt-4 not-italic">
                  <p className="text-base font-medium text-navy-900">IMS Metals &amp; Alloys OÜ</p>
                  <p className="mt-2 content-en text-[0.9375rem] leading-relaxed text-steel-600">
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
                  {contact.whatsapp ? (
                    <a
                      href={
                        "https://wa.me/" +
                        contact.whatsapp.replace(/\D/g, "") +
                        "?text=" +
                        encodeURIComponent(p(contact.whatsappMessage))
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Z" />
                      </svg>
                      {p("Contact us on WhatsApp")}
                    </a>
                  ) : null}
                </address>
              </div>

              <div className="mt-8">
                <h2 className="label text-steel-500">
                  {p("What people come to us for")}
                </h2>
                <ul className="mt-5 space-y-6">
                  {routes.map((route) => (
                    <li key={p(route.title)}>
                      <h3 className="font-display text-base font-semibold text-navy-900">{p(route.title)}</h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-steel-600">{p(route.body)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
