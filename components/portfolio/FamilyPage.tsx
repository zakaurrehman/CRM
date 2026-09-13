import Image from "next/image";
import Link from "next/link";
import type { AlloyCategory } from "@/types/content";
import type { PortfolioFamily } from "@/data/portfolio";
import { acceptedForms, intermediates } from "@/data/portfolio";
import { alloyCategoryBySlug } from "@/data/alloys";
import { familiesInGroup } from "@/lib/portfolio";
import { ElementMark } from "./FamilyCard";
import { IntermediatesList } from "./Intermediates";
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseCategory, localiseTungstenForm } from "@/lib/i18n/content";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RotatingImage } from "@/components/ui/RotatingImage";
import { CompositionTable } from "@/components/materials/CompositionTable";
import { CtaSection } from "@/components/shared/CtaSection";
import { JsonLd, breadcrumbSchema, materialSchema } from "@/lib/schema";
import { contact, routes } from "@/lib/site";

/**
 * Resolves a family's table references into categories the composition
 * table can render. The category keeps its own slug so grade ids — which
 * key the compare tray, saved list and RFQ — are exactly what they were.
 */
export function tablesFor(family: PortfolioFamily, locale: Parameters<typeof localiseCategory>[1]): AlloyCategory[] {
  return family.tables.flatMap((ref) => {
    const base = alloyCategoryBySlug.get(ref.category);
    if (!base) return [];
    const category = localiseCategory(base, locale);
    const grades = category.grades.filter((g) => {
      if (ref.only) return ref.only.includes(g.name);
      if (ref.except) return !ref.except.includes(g.name);
      return true;
    });
    return [{ ...category, grades }];
  });
}

export async function FamilyPage({ family }: { family: PortfolioFamily }) {
  const p = await getP();
  const locale = await getLocale();
  const tables = tablesFor(family, locale);
  const gradeCount = tables.reduce((n, t) => n + t.grades.length, 0);
  const siblings = familiesInGroup(family.group).filter((f) => f.slug !== family.slug).slice(0, 4);
  const forms = family.forms?.map((f) => localiseTungstenForm(f, locale));
  const ownIntermediates = intermediates.filter((g) => g.family === family.slug).flatMap((g) => g.items);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/materials" },
    { name: family.name, href: "/materials/" + family.slug },
  ];

  return (
    <>
      {/* The dark band, plain — no photograph behind it and no button in it
          — so every material opens the same way and the band stays slim
          (IMS, 14 September 2026). The photographs, where IMS has supplied
          them, are in the section below. */}
      <PageHero
        eyebrow={p("Portfolio")}
        title={p(family.name)}
        tone="dark"
        mark={<ElementMark symbol={family.symbol} size="lg" aligned={false} tone="onDark" />}
        intro={
          <>
            {p(family.accepts)}
            {family.detail ? <> {p(family.detail)}</> : null}
          </>
        }
        trail={trail}
      >
        {family.threshold ? (
          <span className="inline-flex items-center gap-2 text-[0.875rem] text-steel-300">
            <span className="rounded-full bg-white/15 px-2.5 py-1 font-medium text-white">{family.threshold}</span>
            {p("metal content")}
          </span>
        ) : null}
      </PageHero>

      {/* What is accepted, and how to ask. The header already carries the
          one-line description; this says the shape of the lots and the
          condition on them, once (IMS, 14 September 2026). */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("What we accept")}</h2>
            <p className="mt-5 text-base leading-relaxed text-steel-700">{p(family.acceptance)}</p>

            {family.accepted ? (
              /* The trade's categories for this metal, one per line — the
                 same quiet list the intermediates use. */
              <ul className="mt-8 border-t border-steel-200">
                {family.accepted.map((entry, i) => (
                  <Reveal as="li" key={entry.term} delay={i * 40} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-steel-200 py-3">
                    <span className="text-[0.9375rem] font-medium text-navy-900">{p(entry.term)}</span>
                    {entry.note ? <span className="text-[0.875rem] text-steel-500">{p(entry.note)}</span> : null}
                  </Reveal>
                ))}
              </ul>
            ) : null}

            <h3 className="mt-10 label text-steel-500">
              {p("Forms")}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {acceptedForms.map((form) => (
                <li key={form.name} className="rounded-full bg-steel-100 px-3.5 py-1.5 text-[0.875rem] text-navy-900">
                  {p(form.name)}
                </li>
              ))}
            </ul>

            {ownIntermediates.length > 0 ? (
              <div className="mt-10">
                <h3 className="label text-steel-500">
                  {p("Powders, oxides & intermediates")}
                </h3>
                <IntermediatesList items={ownIntermediates} className="mt-4" />
              </div>
            ) : null}

            {family.images.length > 0 ? (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-navy-950">
                <RotatingImage images={family.images} sizes="(min-width: 1024px) 58vw, 100vw" />
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border-t-2 border-brand-700 bg-steel-50 p-6">
              <h3 className="font-display text-lg font-medium text-navy-900">{p("Offer material")}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-steel-600">
                {p("Send the grade or analysis, the form and the quantity, with any analysis or photographs attached. Off-spec and mixed lots are welcome — say what you know and we will assess the available route.")}
              </p>
              <div className="mt-6">
                <Button href={routes.offer} variant="primary" className="w-full">
                  {p("Offer material")}
                </Button>
              </div>
              <p className="mt-4 text-[0.8125rem] text-steel-500">
                {p("Or email")}{" "}
                <a href={"mailto:" + contact.email} className="text-navy-900 underline decoration-steel-300 underline-offset-4 hover:decoration-brand-700">
                  {contact.email}
                </a>
              </p>
              <p className="mt-4 border-t border-steel-200 pt-4 text-[0.8125rem] text-steel-500">
                {p("Looking for supply instead?")}{" "}
                <Link href={routes.supply} className="font-medium text-navy-900 underline decoration-steel-300 underline-offset-4 hover:decoration-brand-700">
                  {p("Request supply")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Specific forms with photographs — the tungsten page, folded in */}
      {forms && forms.length > 0 ? (
        <Section tone="light">
          <SectionHeader
            eyebrow={p("Forms we take")}
            title={p("Tungsten arrives in more shapes than any other metal we take.")}
            description={p("Solid tooling, inserts, rolls and crucibles through to swarf and grinding sludge. Each is a distinct stream, and each is priced on what is actually recoverable.")}
            align="split"
          />
          <ul className="mt-12 grid grid-rule sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form, i) => (
              <Reveal as="li" key={form.slug} id={"form-" + form.slug} delay={(i % 3) * 70} className="bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-steel-100">
                  <Image
                    src={form.image}
                    alt={form.name}
                    fill
                    sizes="(min-width: 1024px) 28rem, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-medium text-navy-900">{form.name}</h3>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-steel-600">{form.note}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Published compositions */}
      {tables.length > 0 ? (
        <Section tone={forms ? "white" : "light"} id="reference">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">{p("Grade reference")}</p>
            <h2 className="text-display-md">{p("{n} grades, with nominal composition as published.", { n: gradeCount })}</h2>
            <p className="mt-4 text-[0.9375rem] text-steel-600">
              {p("Reference values for identifying material, not a purchasing or supply specification — see the note under each table.")}
            </p>
          </div>
          <div className="mt-12 space-y-16">
            {tables.map((table) => (
              <CompositionTable
                key={table.slug}
                category={table}
                heading={tables.length > 1 ? table.name : undefined}
                id={tables.length > 1 ? "composition-" + table.slug : "composition"}
                filterLabel={p("Filter {noun} grades by name", { noun: p(family.noun) })}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {siblings.length > 0 ? (
        <Section tone="white">
          <h2 className="text-display-sm">{p("Also in the portfolio")}</h2>
          <ul className="mt-8 grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((item) => (
              <li key={item.slug} className="bg-white">
                <Link href={"/materials/" + item.slug} className="group flex h-full flex-col p-6 transition-colors hover:bg-steel-50">
                  <div className="flex items-center gap-3">
                    <ElementMark symbol={item.symbol} />
                    <h3 className="font-display text-[1.0625rem] font-medium leading-snug text-navy-900 transition-colors group-hover:text-brand-700">
                      {p(item.name)}
                    </h3>
                  </div>
                  <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-steel-600">{p(item.accepts)}</p>
                  {item.threshold ? (
                    <span className="mt-4 self-start rounded-full bg-steel-100 px-2.5 py-0.5 text-[0.75rem] font-medium text-navy-900">{item.threshold}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaSection
        title={p("Have {nameLower} to place?", { name: p(family.name), nameLower: p(family.name).toLowerCase() })}
        body={p("The grade or analysis, the form and the quantity are enough to start. We will assess the available route.")}
      />

      <JsonLd
        data={[
          breadcrumbSchema(trail),
          materialSchema({
            name: family.name,
            description: family.accepts,
            slug: family.slug,
            /* Only a photograph of the material itself; no stock image
               stands in for one. */
            image: family.images[0],
            gradeCount,
          }),
        ]}
      />
    </>
  );
}
