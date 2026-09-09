import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/lib/site";
import { recoveryStreams } from "@/data/recovery";
import { alloyCategorySummaries, totalGradeCount } from "@/data/alloy-index";

const trail = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Contact IMS"),
  description:
    p("Talk to IMS Metals & Alloys OÜ about supplying, recovering or certifying specialist metals and alloys. Head office in Tallinn, Estonia."),
  path: "/contact",
});
}

const routes = [
  {
    title: "Buying material",
    body: "Looking for a specific alloy or grade? We document {count} grades and handle a good deal more, including pure metals and ferro-alloys.",
    count: totalGradeCount,
  },
  {
    title: "Selling or recycling",
    body: "We treat {count} distinct metal-bearing streams, from fine dusts and filtercakes through to turnings and solids.",
    count: recoveryStreams.length,
  },
  {
    title: "Aerospace programmes",
    body: "Engine teardown, onsite destruction of life-limited parts, superalloy grading and precious metal recovery.",
    count: 0,
  },
];

export default async function ContactPage() {
  const p = await getP();
  return (
    <>
      <PageHero
        eyebrow={p("Contact")}
        title={p("Talk to IMS")}
        intro={p("Tell us the alloy, the stream or the volume you are working with and we will come back with a route for it — whether that is supply, recovery or both.")}
        trail={trail}
      />

      <Section tone="white">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("Request an inquiry")}</h2>
            <p className="mt-4 max-w-xl content-en text-[1.0625rem] leading-relaxed text-steel-600">
              {p("The more you can tell us about the material, the faster we can come back with something useful.")}
            </p>
            <div className="mt-10">
              <InquiryForm materialNames={alloyCategorySummaries.map((c) => c.name)} />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <div className="border-t-2 border-brand-700 bg-steel-50 p-7">
                <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                  {p("Head office")}
                </h2>
                <address className="mt-4 not-italic">
                  <p className="text-[1.0625rem] font-medium text-navy-900">IMS Metals &amp; Alloys OÜ</p>
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
                  {contact.phone ? (
                    <a
                      href={"tel:" + contact.phone.replace(/[^+0-9]/g, "")}
                      className="mt-2 block text-[0.9375rem] font-medium text-brand-700"
                    >
                      {contact.phone}
                    </a>
                  ) : null}
                </address>
              </div>

              <div className="mt-8">
                <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                  {p("What people come to us for")}
                </h2>
                <ul className="mt-5 space-y-6">
                  {routes.map((route) => (
                    <li key={p(route.title)}>
                      <h3 className="font-display text-base font-semibold text-navy-900">{p(route.title)}</h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-steel-600">{p(route.body, { count: route.count })}</p>
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
