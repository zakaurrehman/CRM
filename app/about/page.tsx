import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProcessSteps } from "@/components/shared/ProcessSteps";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { companyFacts, contact } from "@/lib/site";
import { alloyCategoryCount, totalGradeCount } from "@/data/alloy-index";

const trail = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("About IMS"),
  description:
    p("A metals trading company sorting, processing and certifying arisings from the petrochemical, oil & gas, gas turbine and aerospace sectors."),
  path: "/about",
  image: "/images/company/port-terminal.jpg",
});
}

const differentiators = [
  {
    title: "Both sides of the chain",
    body: "We supply prime alloys and recover them at end of life. Handling material in both directions is what keeps our grade identification accurate.",
  },
  {
    title: "Nothing leaves unsorted",
    body: "Arisings are 100% sorted and segregated before processing, so alloy content is never quietly downgraded into a mixed stream.",
  },
  {
    title: "Certified, not assumed",
    body: "Material is analysed and certified before sale, so what reaches the melt shop matches what was ordered.",
  },
  {
    title: "Difficult streams welcome",
    body: "Fine dusts, filtercakes, sludges and mixed tungsten forms are routine work rather than exceptions.",
  },
];

export default async function AboutPage() {
  const p = await getP();
  return (
    <>
      <PageHero
        eyebrow={p("About")}
        title={p("A trading company built on knowing exactly what the metal is.")}
        intro={p("IMS Metals & Alloys OÜ trades and processes specialist metals and alloys. Our business began with routes in Eastern Europe and has grown into an international network, with joint partnerships alongside several of the largest leading companies in the world.")}
        trail={trail}
        image="/images/company/port-terminal.jpg"
        imageAlt=""
      />

      {/* Who IMS is */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("Who we are")}</h2>
            <div className="mt-6 space-y-5 content-en text-base leading-relaxed text-steel-700">
              <p>
                {p("We handle a wide variety of stainless steel, low alloy steels, die steel, nickel, cobalt, complex nickel superalloys, pure metals and ferro-alloys, which arise from the petrochemical, oil and gas, industrial gas turbine and aerospace sectors.")}
              </p>
              <p>
                {p("These arisings are 100% sorted, segregated, processed and certified, then sold to end customers around the world to be melted back into their parent alloys as either air-melt or vacuum grade products.")}
              </p>
              <p>
                {p("We serve a range of industries with environmental compliance and cost-effective recycling solutions for stainless steel, soft metallic waste streams, superalloy reverts, high temperature alloys and pure metals.")}
              </p>
            </div>

            <div className="mt-10 border-s-2 border-brand-700 ps-6">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                {p("Registered office")}
              </p>
              <p className="mt-2 text-[0.9375rem] text-navy-900">
                {contact.address.street}, {contact.address.city} {contact.address.postalCode},{" "}
                {contact.address.country}
              </p>
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

      {/* Capabilities */}
      <Section tone="light" id="capabilities">
        <SectionHeader
          eyebrow={p("Our capabilities")}
          title={p("What we handle, in specifics.")}
          description={p("The clearest way to describe this business is by the metals that pass through it.")}
          align="split"
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div>
            <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
              {p("Specialist metals")}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {companyFacts.specialistMetals.map((metal) => (
                <li key={metal} className="border-b border-steel-200 pb-2.5 text-[0.9375rem] text-navy-900">
                  {p(metal)}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.875rem] text-steel-600">
              {p("Plus precious metals recovered from aerospace streams.")}
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
              Ferro-alloys
            </h3>
            <p className="mt-5 content-en text-[0.9375rem] leading-relaxed text-steel-600">
              {p("A full range of ferro-alloys, available in all sizes, packings and specifications.")}
            </p>
            <ul className="mt-5 grid grid-cols-2 grid-rule">
              {companyFacts.ferroAlloys.map((ferro) => (
                <li key={ferro} className="bg-white px-4 py-4 text-center font-mono text-[0.9375rem] text-navy-900">
                  {ferro}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
              {p("Documented alloys")}
            </h3>
            <p className="mt-5 content-en text-[0.9375rem] leading-relaxed text-steel-600">
              {p("We publish nominal composition data for {grades} grades across {cats} categories, so a specification can be checked before an enquiry is even sent.", { grades: totalGradeCount, cats: alloyCategoryCount })}
            </p>
            <div className="mt-6">
              <ArrowLink href="/materials">{p("Open the materials directory")}</ArrowLink>
            </div>
            <figure className="relative mt-8 aspect-[4/3] overflow-hidden">
              <Image
                src="/images/metals/stamped-components.jpg"
                alt={p("Stamped stainless steel components")}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </Section>

      {/* What makes IMS different */}
      <Section tone="white">
        <SectionHeader eyebrow={p("What makes us different")} title={p("Four things we do not compromise on.")} align="split" />
        <ul className="mt-14 grid grid-rule sm:grid-cols-2">
          {differentiators.map((item, i) => (
            <Reveal as="li" key={p(item.title)} delay={i * 70} className="bg-white p-7 lg:p-9">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-700 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-navy-900">
                {p(item.title)}
              </h3>
              <p className="mt-3 content-en text-[0.9375rem] leading-relaxed text-steel-600">{p(item.body)}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Process */}
      <Section tone="navy" id="process">
        <SectionHeader
          eyebrow={p("How IMS works")}
          title={p("Six steps from arising to certified supply.")}
          align="split"
          className="[&_h2]:text-white"
        />
        <div className="mt-14">
          <ProcessSteps tone="dark" />
        </div>
      </Section>

      {/* Onward routes */}
      <Section tone="light">
        <div className="grid gap-8 sm:grid-cols-2">
          {[
            {
              title: "Quality & Compliance",
              body: "Our metallurgical laboratory, the testing behind each consignment, and how material stays traceable.",
              href: "/about/quality-and-compliance",
              image: "/images/hero/hot-metal-plate.jpg",
            },
            {
              title: "Sustainability",
              body: "Recovered metal units replacing material that would otherwise come from primary mining.",
              href: "/about/sustainability",
              image: "/images/company/recycling-operations.jpg",
            },
          ].map((card) => (
            <Link key={card.href} href={card.href} className="group flex flex-col bg-white">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-swift group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <h3 className="font-display text-xl font-semibold text-navy-900 transition-colors group-hover:text-brand-700">
                  {p(card.title)}
                </h3>
                <p className="mt-2.5 content-en text-[0.9375rem] leading-relaxed text-steel-600">{p(card.body)}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <CtaSection secondary={{ href: "/materials", label: p("Explore materials") }} />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
