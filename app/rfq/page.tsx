import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { RfqForm } from "@/components/forms/RfqForm";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import { contact, routes } from "@/lib/site";
import { isRfqDirection, type RfqDirection } from "@/lib/rfq";

/**
 * One address, two pages (IMS, 14 September 2026): ?direction=sell is
 * "Offer Material" and ?direction=buy is "Request Supply", each with its own
 * title, introduction and next steps. Without a direction the page asks,
 * and the form's radio answers — it updates the address, so this header
 * follows.
 */
const copy: Record<RfqDirection | "either", { eyebrow: string; title: string; intro: string; crumb: string }> = {
  sell: {
    eyebrow: "Selling to IMS",
    title: "Offer Material",
    intro: "Submit the material, form, quantity and available analysis. IMS will assess the material and identify the most suitable commercial and processing route through our specialist network.",
    crumb: "Offer material",
  },
  buy: {
    eyebrow: "Buying from IMS",
    title: "Request Supply",
    intro: "Tell us the required material, chemistry, form, quantity and delivery location, and we will review supply availability.",
    crumb: "Request supply",
  },
  either: {
    eyebrow: "Inquiry",
    title: "Offer material, or request supply",
    intro: "Tell us whether you are selling or buying, and the form asks for what we need to know on that side.",
    crumb: "Inquiry",
  },
};

const steps: Record<RfqDirection | "either", { t: string; b: string }[]> = {
  sell: [
    { t: "We assess the material", b: "Chemistry, form and condition, from what you send — an analysis and photographs make this quick." },
    { t: "We identify the route", b: "The most suitable commercial and processing route through our specialist network, and an offer where there is one." },
    { t: "We confirm the detail", b: "Sampling, packaging, logistics and terms are agreed before anything moves." },
  ],
  buy: [
    { t: "We review availability", b: "Each line is checked against what we can supply, including material that is not published on the site." },
    { t: "We come back with a quote", b: "Price, availability and lead time against exactly what you asked for." },
    { t: "We confirm the detail", b: "Chemistry, form, packaging and delivery terms are agreed before anything moves." },
  ],
  either: [
    { t: "We read what you send", b: "Each line is checked on its own — material, form, quantity, and the analysis or specification with it." },
    { t: "We come back with a route", b: "An offer and a processing route where you are selling; price and availability where you are buying." },
    { t: "We confirm the detail", b: "Form, analysis, packaging and delivery terms are agreed before anything moves." },
  ],
};

async function directionFrom(searchParams: Promise<{ direction?: string }>): Promise<RfqDirection | undefined> {
  const { direction } = await searchParams;
  return isRfqDirection(direction) ? direction : undefined;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ direction?: string }> }): Promise<Metadata> {
  const p = await getP();
  const direction = await directionFrom(searchParams);
  const c = copy[direction ?? "either"];
  return pageMetadata({
    title: p(c.title),
    description: p(c.intro),
    path: direction ? `${routes.rfq}?direction=${direction}` : routes.rfq,
  });
}

export default async function RfqPage({
  searchParams,
}: {
  searchParams: Promise<{ direction?: string }>;
}) {
  const p = await getP();
  const direction = await directionFrom(searchParams);
  const key = direction ?? "either";
  const c = copy[key];
  const trail = [
    { name: "Home", href: "/" },
    { name: c.crumb, href: direction ? `${routes.rfq}?direction=${direction}` : routes.rfq },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero eyebrow={p(c.eyebrow)} title={p(c.title)} intro={p(c.intro)} trail={trail} />

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 xl:col-span-8">
            <Suspense
              fallback={<p className="text-[0.9375rem] text-steel-600">{p("Loading the form…")}</p>}
            >
              <RfqForm preset={direction} />
            </Suspense>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-lg border border-steel-200 bg-white p-6">
                <h2 className="font-display text-lg font-medium text-navy-900">{p("What happens next")}</h2>
                <ol className="mt-4 space-y-4">
                  {steps[key].map((step, i) => (
                    <li key={step.t} className="flex gap-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 font-mono text-[0.6875rem] font-medium text-brand-800">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display text-[0.9375rem] font-medium text-navy-900">{p(step.t)}</p>
                        <p className="mt-1 text-[0.875rem] leading-relaxed text-steel-600">{p(step.b)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg border border-steel-200 bg-white p-6">
                <h2 className="font-display text-lg font-medium text-navy-900">{p("Rather send it by email?")}</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-steel-600">
                  {p("Larger packs — full inspection reports, sets of original photographs — can go straight to us by email, with your company name in the subject.")}
                </p>
                <a
                  href={"mailto:" + contact.email}
                  className="mt-4 inline-flex min-h-[1.75rem] items-center text-[0.9375rem] font-medium text-brand-700 underline underline-offset-4 hover:text-brand-900"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
