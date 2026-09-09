import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, industryBySlug } from "@/data/industries";
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseIndustry, localiseCategory } from "@/lib/i18n/content";
import { alloyCategoryBySlug } from "@/data/alloys";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { Button } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const base = industryBySlug.get(slug);
  if (!base) return {};
  const industry = localiseIndustry(base, await getLocale());

  return pageMetadata({
    title: industry.name,
    description: `${industry.strapline}. ${industry.capabilities.map((c) => c.title).join(", ")}.`,
    path: "/industries/" + industry.slug,
    image: industry.image,
  });
}

export default async function IndustryPage({ params }: Params) {
  const p = await getP();
  const { slug } = await params;
  const locale = await getLocale();
  const base = industryBySlug.get(slug);
  if (!base) notFound();
  const industry = localiseIndustry(base, locale);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/industries" },
    { name: industry.name, href: "/industries/" + industry.slug },
  ];

  const materials = industry.materials
    .map((materialSlug) => alloyCategoryBySlug.get(materialSlug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category))
    .map((category) => localiseCategory(category, locale));

  /* Counted from the catalogue rather than stated, so the figure on a sector
     page cannot drift away from the tables it summarises. */
  const sectorGradeCount = materials.reduce((total, category) => total + category.grades.length, 0);
  const sectorElements = [
    ...new Set(materials.flatMap((category) => category.elements.filter((e) => e !== "Others"))),
  ];

  return (
    <>
      <PageHero
        eyebrow={industry.strapline}
        title={industry.name}
        intro={industry.intro}
        trail={trail}
        image={industry.image}
        imageAlt=""
      />

      <Section tone="white">
        <SectionHeader
          eyebrow={p("Capabilities")}
          title={"What we do for " + industry.name.toLowerCase() + "."}
          align="split"
        />
        <ul className="mt-14 grid grid-rule sm:grid-cols-2">
          {industry.capabilities.map((capability, i) => (
            <Reveal as="li" key={capability.title} delay={i * 70} className="bg-white p-7 lg:p-9">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-700 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-navy-900">
                {capability.title}
              </h3>
              <p className="mt-3 content-en text-[0.9375rem] leading-relaxed text-steel-600">{capability.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {materials.length > 0 ? (
        <Section tone="light">
          <SectionHeader
            eyebrow={p("Materials")}
            title={p("Alloy families we supply into this sector.")}
            description={p("Each category carries its published nominal composition for every grade.")}
            align="split"
          />
          <div className="mt-12 grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((category) => (
              <MaterialCard key={category.slug} category={category} className="border-0" />
            ))}
          </div>

          {/* What is actually available for this sector, in numbers, with a
              route straight into the catalogue tools rather than a dead end. */}
          <div className="mt-12 rounded-lg border border-steel-200 bg-white p-7 lg:p-9">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-7">
                <h3 className="font-display text-xl font-semibold tracking-tight text-navy-900">
                  {p("{n} grades documented for {sector}", { n: sectorGradeCount, sector: industry.name.toLowerCase() })}
                </h3>
                <p className="mt-3 content-en text-[0.9375rem] leading-relaxed text-steel-600">
                  {p("Across {cats} categories, covering {elements}{extra}. Search them by composition, line up candidates side by side, or send a specification straight through for pricing.", {
                    cats: materials.length,
                    elements: sectorElements.slice(0, 8).join(", "),
                    extra: sectorElements.length > 8
                      ? p(" and {n} more elements", { n: sectorElements.length - 8 })
                      : "",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
                <Button href="/materials/finder">{p("Search by composition")}</Button>
                <Button href="/rfq" variant="secondary">{p("Request a quotation")}</Button>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      <Section tone="white">
        <div className="border-t border-steel-200 pt-10">
          <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
            {p("Other sectors")}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {industries
              .map((other) => localiseIndustry(other, locale))
              .filter((other) => other.slug !== industry.slug)
              .map((other) => (
                <li key={other.slug}>
                  <Link
                    href={"/industries/" + other.slug}
                    className="inline-flex items-center rounded-sm border border-steel-300 px-4 py-2 text-[0.9375rem] text-steel-700 transition-colors hover:border-brand-700 hover:text-brand-700"
                  >
                    {other.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </Section>

      <CtaSection
        title={"Talk to us about " + industry.name.toLowerCase() + " material."}
        body={p("Supply, recovery or both — tell us the specification and the volume and we will come back with a route for it.")}
        primary={{ href: "/rfq", label: p("Request a quotation") }}
        secondary={{ href: "/materials/finder", label: p("Search by composition") }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
