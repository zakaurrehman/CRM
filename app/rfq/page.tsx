import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { RfqForm } from "@/components/forms/RfqForm";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import { contact } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Request a Quotation"),
  description:
    p("Send IMS a line-by-line quotation request: grade, quantity, condition and specification for each material, whether you are buying prime alloy or selling revert."),
  path: "/rfq",
});
}

const trail = [
  { name: "Home", href: "/" },
  { name: "Request a quotation", href: "/rfq" },
];

export default async function RfqPage() {
  const p = await getP();
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow={p("Quotation request")}
        title={p("Price a list, not a paragraph.")}
        intro={p("One line per material, each with its own quantity, condition and specification notes — so the answer comes back against exactly what you asked for.")}
        trail={trail}
      />

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 xl:col-span-8">
            <Suspense
              fallback={<p className="text-[0.9375rem] text-steel-600">{p("Loading the request form…")}</p>}
            >
              <RfqForm />
            </Suspense>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-lg border border-steel-200 bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-navy-900">{p("What happens next")}</h2>
                <ol className="mt-4 space-y-4">
                  {[
                    { t: "We read the specification", b: "Each line is checked against what we can source or recover, including material that is not published on the site." },
                    { t: "We come back with a route", b: "Price and availability where we can supply, or an offer where you are selling material to us." },
                    { t: "We confirm the detail", b: "Form, analysis, packaging and delivery terms are agreed before anything moves." },
                  ].map((step, i) => (
                    <li key={step.t} className="flex gap-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 font-mono text-[0.6875rem] font-medium text-brand-800">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display text-[0.9375rem] font-semibold text-navy-900">{p(step.t)}</p>
                        <p className="mt-1 text-[0.875rem] leading-relaxed text-steel-600">{p(step.b)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg border border-steel-200 bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-navy-900">{p("Rather send it by email?")}</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-steel-600">
                  {p("Attach an analysis, a drawing or a specification sheet and send it straight to us.")}
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
