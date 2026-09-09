import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { industries } from "@/data/industries";
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseIndustry } from "@/lib/i18n/content";
import { companyFacts } from "@/lib/site";

const trail = [
  { name: "Home", href: "/" },
  { name: "Industries", href: "/industries" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Industries Served"),
  description:
    p("Specialist alloys supplied and recovered for aerospace, oil & gas, industrial gas turbine, and technology and mobility sectors."),
  path: "/industries",
  image: "/images/turbine/turbine-manufacturing.jpg",
});
}

export default async function IndustriesPage() {
  const p = await getP();
  const locale = await getLocale();
  const sectors = industries.map((i) => localiseIndustry(i, locale));

  return (
    <>
      <PageHero
        eyebrow={p("Industries")}
        title={p("Industries served")}
        intro={p("Our arisings come from the petrochemical, oil and gas, industrial gas turbine and aerospace sectors, and the material we recover goes back to those same industries. Working in both directions is what keeps grade knowledge sharp.")}
        trail={trail}
        image="/images/turbine/turbine-manufacturing.jpg"
        imageAlt=""
      />

      <Section tone="white">
        <ul className="space-y-px bg-steel-200">
          {sectors.map((industry, i) => (
            <Reveal as="li" key={industry.slug} delay={i * 60} className="bg-white">
              <Link
                href={"/industries/" + industry.slug}
                className="group grid items-center gap-8 py-10 lg:grid-cols-12 lg:gap-12 lg:py-12"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-steel-100 lg:col-span-5 lg:aspect-[4/3]">
                  <Image
                    src={industry.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
                  />
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-brand-700">
                    {industry.strapline}
                  </p>
                  <h2 className="mt-3 font-display text-display-sm text-navy-900 transition-colors group-hover:text-brand-700">
                    {industry.name}
                  </h2>
                  <p className="mt-4 content-en text-[1.0625rem] leading-relaxed text-steel-600">{industry.intro}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                    {industry.capabilities.map((capability) => (
                      <li key={capability.title} className="text-[0.875rem] text-steel-500">
                        {capability.title}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-7 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-brand-700">
                    {industry.name} capabilities
                    <span
                      aria-hidden
                      className="transition-transform duration-200 ease-swift group-hover:translate-x-1"
                    >
                      <span className="dir-arrow">&rarr;</span>
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-display-sm">{p("Wider sectors supplied")}</h2>
            <p className="mt-5 content-en text-[1.0625rem] leading-relaxed text-steel-600">
              {p("Beyond the four sectors above, our material and recovery services reach a broader set of industries that depend on the same alloy families.")}
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="grid grid-rule sm:grid-cols-2">
              {companyFacts.sectors.map((sector) => (
                <li key={sector} className="bg-steel-50 px-5 py-4 text-[0.9375rem] text-navy-900">
                  {p(sector)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaSection secondary={{ href: "/materials", label: p("Explore materials") }} />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
