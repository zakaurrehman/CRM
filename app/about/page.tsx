import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { Advantage } from "@/components/shared/Advantage";
import { CtaSection } from "@/components/shared/CtaSection";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact, registration, site } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("About IMS"),
    description: p(
      "IMS Metals & Alloys OÜ, Tallinn: a specialised recycler and supplier to the nickel refinery, stainless steel, superalloy, titanium and refractory metals industries.",
    ),
    path: "/about",
    image: "/images/company/port-terminal.jpg",
  });
}

/**
 * Who IMS is, in the intro's words, with the company's registered details.
 *
 * What is no longer here — the six-step process, the metallurgical
 * laboratory, the differentiators — was the previous website's description of
 * the business. See docs/refocus-plan.md §8 for the items IMS is confirming.
 */
export default async function AboutPage() {
  const p = await getP();

  return (
    <>
      <PageHero
        eyebrow={p("About")}
        title={p("Who we are")}
        intro={p(
          "IMS Metals & Alloys OÜ is a specialised recycler and supplier to the global nickel refinery, stainless steel, superalloy, titanium and refractory metals industries. With advanced expertise, we provide tailored blending solutions that create efficiency and cost savings for refiners, alloy producers and the stainless-steel sector.",
        )}
        trail={trail}
        image="/images/company/port-terminal.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("What we do")}</h2>
            <div className="mt-6 space-y-5 content-en text-base leading-relaxed text-steel-700">
              <p>
                {p("Through our specialised blending program, we transform complex scrap streams into high-value Ni-based blends — maximising recoverable metal content and reducing downgrading.")}
              </p>
              <p>
                {p("We make sure to be able to manage each complex material: off-spec grades, mixed lots, and off-grade refractory metals — tungsten, molybdenum, niobium and tantalum — alongside an expanding capability in hafnium and advanced master alloys.")}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href="/what-we-do">{p("How the program works")}</ArrowLink>
              <ArrowLink href="/materials">{p("Open the portfolio")}</ArrowLink>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <figure className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/company/scrap-yard.jpg"
                alt={p("Sorted metal arisings staged for processing")}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </Section>

      <Advantage />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-display-sm">{p("The company")}</h2>
            <p className="mt-5 content-en text-base leading-relaxed text-steel-600">
              {p("Registered in Estonia and trading internationally.")}
            </p>
          </div>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">{p("Registered entity")}</dt>
              <dd className="mt-1.5 text-[0.9375rem] text-navy-900">{site.legalName}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">{p("Registered office")}</dt>
              <dd className="mt-1.5 text-[0.9375rem] text-navy-900">
                {contact.address.street}, {contact.address.city} {contact.address.postalCode}, {contact.address.country}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">{p("Registration no.")}</dt>
              <dd className="mt-1.5 font-mono text-[0.9375rem] text-navy-900 tabular-nums">{registration.number}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">EORI</dt>
              <dd className="mt-1.5 font-mono text-[0.9375rem] text-navy-900 tabular-nums">{registration.eori}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">{p("Direct contact")}</dt>
              <dd className="mt-1.5">
                <a
                  href={"mailto:" + contact.email}
                  className="text-[0.9375rem] text-navy-900 underline decoration-steel-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <CtaSection secondary={{ href: "/materials", label: p("See our portfolio") }} />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
