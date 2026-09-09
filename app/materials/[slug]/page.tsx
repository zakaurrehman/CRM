import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { alloyCategories, alloyCategoryBySlug } from "@/data/alloys";
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseCategory, localiseIndustry } from "@/lib/i18n/content";
import { industries } from "@/data/industries";
import { alloyGroupLabels } from "@/lib/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { CompositionTable } from "@/components/materials/CompositionTable";
import { CtaSection } from "@/components/shared/CtaSection";
import { Button } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema, materialSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return alloyCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const base = alloyCategoryBySlug.get(slug);
  if (!base) return {};
  const category = localiseCategory(base, await getLocale());

  return pageMetadata({
    title: category.name,
    description: `${category.grades.length} ${category.name.toLowerCase()} grades with nominal chemical composition, properties and applications. ${category.properties.join(", ")}.`,
    path: "/materials/" + category.slug,
    image: category.image,
  });
}

export default async function MaterialPage({ params }: Params) {
  const p = await getP();
  const { slug } = await params;
  const locale = await getLocale();
  const base = alloyCategoryBySlug.get(slug);
  if (!base) notFound();
  const category = localiseCategory(base, locale);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Materials", href: "/materials" },
    { name: category.name, href: "/materials/" + category.slug },
  ];

  /**
   * Always three related materials, in decreasing order of relevance: same
   * alloy group first, then anything sharing an application, then the largest
   * remaining categories. Group alone is not enough — cobalt and non-ferrous
   * hold only two categories each, which would leave the row a third full.
   */
  const others = alloyCategories
    .filter((c) => c.slug !== category.slug)
    .map((c) => localiseCategory(c, locale));
  const sharesApplication = (c: (typeof others)[number]) =>
    c.applications.some((a) => category.applications.includes(a));
  const related = [
    ...others.filter((c) => c.group === category.group),
    ...others.filter((c) => c.group !== category.group && sharesApplication(c)),
    ...others.filter((c) => c.group !== category.group && !sharesApplication(c)).sort((a, b) => b.grades.length - a.grades.length),
  ].slice(0, 3);
  const servedIndustries = industries.filter((i) => i.materials.includes(category.slug));

  return (
    <>
      <PageHero
        eyebrow={p(alloyGroupLabels[category.group])}
        title={category.name}
        intro={category.summary}
        trail={trail}
        image={category.image}
        imageAlt=""
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-400">{p("Grades")}</dt>
            <dd className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
              {category.grades.length}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-400">
              {p("Elements tabulated")}
            </dt>
            <dd className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
              {category.elements.length}
            </dd>
          </div>
        </dl>
      </PageHero>

      {/* Overview, properties, applications */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("Overview")}</h2>
            <p className="mt-5 content-en text-[1.0625rem] leading-relaxed text-steel-700">{category.summary}</p>
            <p className="mt-4 content-en text-[1.0625rem] leading-relaxed text-steel-700">
              {p("IMS handles {name} as both prime material and as arisings recovered from industrial processing. Material is sorted and segregated by grade, so it returns to the melt as a known specification rather than a mixed stream.", { name: category.name.toLowerCase() })}
            </p>

            {servedIndustries.length > 0 ? (
              <div className="mt-10">
                <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                  {p("Sectors we supply this into")}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {servedIndustries.map((industry) => (
                    <li key={industry.slug}>
                      <Link
                        href={"/industries/" + industry.slug}
                        className="inline-flex items-center rounded-sm border border-steel-300 px-3 py-1.5 text-[0.875rem] text-steel-700 transition-colors hover:border-brand-700 hover:text-brand-700"
                      >
                        {localiseIndustry(industry, locale).name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border-t-2 border-brand-700 bg-steel-50 p-6">
              <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                {p("Properties")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {category.properties.map((property) => (
                  <li key={property} className="flex gap-3 text-[0.9375rem] text-navy-900">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-brand-700" />
                    {property}
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                {p("Applications")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {category.applications.map((application) => (
                  <li key={application} className="flex gap-3 text-[0.9375rem] text-navy-900">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-brand-700" />
                    {application}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button href="/contact" variant="primary" className="w-full">
                  {p("Discuss this material")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Composition table */}
      <Section tone="light">
        <CompositionTable category={category} />
      </Section>

      {related.length > 0 ? (
        <Section tone="white">
          <h2 className="text-display-sm">{p("Related materials")}</h2>
          <ul className="mt-8 grid grid-rule sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={"/materials/" + item.slug} className="group flex h-full flex-col bg-white p-6">
                  <div className="relative mb-5 aspect-[16/9] overflow-hidden bg-steel-100">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-swift group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy-900 transition-colors group-hover:text-brand-700">
                    {item.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-steel-600">{item.summary}</p>
                  <span className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-steel-500 tabular-nums">
                    {item.grades.length} grades
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaSection
        title={"Discuss " + category.name.toLowerCase() + " with IMS."}
        body={p("Tell us the grade, the form and the quantity. We will confirm what we can supply or recover, and the certification that comes with it.")}
        primary={{ href: "/contact", label: "Discuss this material" }}
        secondary={{ href: "/materials", label: "All materials" }}
      />

      <JsonLd
        data={[
          breadcrumbSchema(trail),
          materialSchema({
            name: category.name,
            description: category.summary,
            slug: category.slug,
            image: category.image,
            gradeCount: category.grades.length,
          }),
        ]}
      />
    </>
  );
}
