import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact, registration, routes, site } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("About IMS"),
    description: p(
      "IMS Metals & Alloys OÜ is an Estonia-based international metals recovery and supply company specialising in complex high-nickel, superalloy, titanium and refractory materials.",
    ),
    path: "/about",
  });
}

/**
 * The operating model, in IMS's words of 14 September 2026: what IMS is, how
 * it works, and the registered details. IMS owns no plant or laboratory —
 * it coordinates specialist processing and analysis through independent
 * facilities — and this page is where that is said plainly.
 *
 * Not repeated here: the programme (What we do), the advantages and the
 * closing band (homepage).
 */
const model = [
  "IMS is registered in Estonia and operates internationally.",
  "IMS coordinates specialist processing and analytical services through independent facilities.",
  "IMS focuses on complex, mixed and off-spec materials.",
  "IMS supplies refiners, alloy producers and stainless steel mills.",
  "IMS preserves recoverable metal value wherever technically and commercially possible.",
];

export default async function AboutPage() {
  const p = await getP();

  return (
    <>
      <PageHero
        eyebrow={p("About")}
        title={p("Who we are")}
        intro={p(
          "IMS Metals & Alloys OÜ is an Estonia-based international metals recovery and supply company specialising in complex high-nickel, superalloy, titanium and refractory materials.",
        )}
        trail={trail}
        image="/images/company/port-terminal.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-lg leading-relaxed text-navy-900 sm:text-xl">
              {p("We connect material generators, specialist processors, laboratories, refiners and alloy producers to develop commercially and metallurgically suitable routes for materials that conventional channels may reject or downgrade.")}
            </p>

            <h2 className="mt-9 text-display-sm">{p("How we operate")}</h2>
            <ul className="mt-6 border-t border-steel-200">
              {model.map((line, i) => (
                <Reveal as="li" key={line} delay={i * 50} className="border-b border-steel-200 py-4 text-base leading-relaxed text-navy-900">
                  {p(line)}
                </Reveal>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href={routes.whatWeDo}>{p("How the programme works")}</ArrowLink>
              <ArrowLink href={routes.materials}>{p("Open the portfolio")}</ArrowLink>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <figure className="relative aspect-[3/4] overflow-hidden">
              {/* IMS's own photograph (14 September 2026): cast alloy
                  components in a bulk bag, the material as it arrives. */}
              <Image
                src="/images/news/scrap.jpeg"
                alt={p("Cast alloy components in a bulk bag")}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-display-sm">{p("The company")}</h2>
            <p className="mt-5 text-base leading-relaxed text-steel-600">
              {p("Registered in Estonia and trading internationally.")}
            </p>
          </div>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            <div>
              <dt className="label text-steel-500">{p("Registered entity")}</dt>
              <dd className="mt-1.5 text-[0.9375rem] text-navy-900">{site.legalName}</dd>
            </div>
            <div>
              <dt className="label text-steel-500">{p("Registered office")}</dt>
              <dd className="mt-1.5 text-[0.9375rem] text-navy-900">
                {contact.address.street}, {contact.address.city} {contact.address.postalCode}, {contact.address.country}
              </dd>
            </div>
            <div>
              <dt className="label text-steel-500">{p("Registration no.")}</dt>
              <dd className="mt-1.5 font-mono text-[0.9375rem] text-navy-900 tabular-nums">{registration.number}</dd>
            </div>
            <div>
              <dt className="label text-steel-500">EORI</dt>
              <dd className="mt-1.5 font-mono text-[0.9375rem] text-navy-900 tabular-nums">{registration.eori}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="label text-steel-500">{p("Direct contact")}</dt>
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

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
