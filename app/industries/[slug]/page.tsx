import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, industryBySlug } from "@/data/industries";
import { alloyCategoryBySlug } from "@/data/alloys";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { MaterialCard } from "@/components/materials/MaterialCard";
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
  const industry = industryBySlug.get(slug);
  if (!industry) return {};

  return pageMetadata({
    title: industry.name,
    description: `${industry.strapline}. ${industry.capabilities.map((c) => c.title).join(", ")}.`,
    path: "/industries/" + industry.slug,
    image: industry.image,
  });
}

export default async function IndustryPage({ params }: Params) {
  const { slug } = await params;
  const industry = industryBySlug.get(slug);
  if (!industry) notFound();

  const trail = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/industries" },
    { name: industry.name, href: "/industries/" + industry.slug },
  ];

  const materials = industry.materials
    .map((materialSlug) => alloyCategoryBySlug.get(materialSlug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

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
          eyebrow="Capabilities"
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
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">{capability.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {materials.length > 0 ? (
        <Section tone="light">
          <SectionHeader
            eyebrow="Materials"
            title="Alloy families we supply into this sector."
            description="Each category carries its published nominal composition for every grade."
            align="split"
          />
          <div className="mt-12 grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((category) => (
              <MaterialCard key={category.slug} category={category} className="border-0" />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="white">
        <div className="border-t border-steel-200 pt-10">
          <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
            Other sectors
          </h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {industries
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
        body="Supply, recovery or both — tell us the specification and the volume and we will come back with a route for it."
        primary={{ href: "/contact", label: "Request an inquiry" }}
        secondary={{ href: "/materials", label: "Explore materials" }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
