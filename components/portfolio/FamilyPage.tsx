import Image from "next/image";
import Link from "next/link";
import type { AlloyCategory } from "@/types/content";
import type { PortfolioFamily } from "@/data/portfolio";
import { acceptedForms, intermediates } from "@/data/portfolio";
import { compositionFootnote } from "@/data/alloy-index";
import { alloyCategoryBySlug } from "@/data/alloys";
import { familiesInGroup } from "@/lib/portfolio";
import { SymbolBox } from "./FamilyCard";
import { Intermediates } from "./Intermediates";
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
import { contact } from "@/lib/site";

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
  const ownIntermediates = intermediates.filter((g) => g.family === family.slug);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/materials" },
    { name: family.name, href: "/materials/" + family.slug },
  ];

  return (
    <>
      <PageHero
        eyebrow={p("Portfolio")}
        title={family.name}
        mark={
          <SymbolBox
            symbol={family.symbol}
            size="lg"
            className={family.images[0] ? "border-white/40 bg-white/10 text-white" : undefined}
          />
        }
        intro={
          <>
            {p(family.accepts)}
            {family.detail ? <> {p(family.detail)}</> : null}
          </>
        }
        trail={trail}
        {...(family.images[0] ? { image: family.images[0], imageAlt: "" } : {})}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/rfq" variant={family.images[0] ? "onDark" : "primary"} size="lg">
            {p("Request a quotation")}
          </Button>
          {family.threshold ? (
            <span className="inline-flex items-center gap-2 font-mono text-[0.8125rem] text-steel-500 [.on-dark_&]:text-steel-300">
              <span className="rounded-sm border border-current px-2 py-0.5 font-medium">{family.threshold}</span>
              {p("minimum content")}
            </span>
          ) : null}
        </div>
      </PageHero>

      {/* What is accepted, and how to ask */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-display-sm">{p("What we accept")}</h2>
            <p className="mt-5 content-en text-base leading-relaxed text-steel-700">
              {p(family.accepts)}
              {family.detail ? <> {p(family.detail)}</> : null}
            </p>

            <h3 className="mt-10 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
              {p("Forms")}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {acceptedForms.map((form) => (
                <li key={form.name} className="rounded-sm border border-steel-300 px-3 py-1.5 text-[0.875rem] text-navy-900">
                  {p(form.name)}
                </li>
              ))}
            </ul>

            {ownIntermediates.length > 0 ? (
              <div className="mt-10">
                <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                  {p("Powders, oxides & intermediaries")}
                </h3>
                <Intermediates groups={ownIntermediates} heading={false} className="mt-4" />
              </div>
            ) : null}

            {family.images.length > 1 ? (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-navy-950">
                <RotatingImage images={family.images.slice(1)} sizes="(min-width: 1024px) 58vw, 100vw" />
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border-t-2 border-brand-700 bg-steel-50 p-6">
              <h3 className="font-display text-lg font-semibold text-navy-900">{p("Get a price")}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-steel-600">
                {p("Tell us the grade or analysis, the form and the quantity. Off-spec and mixed lots are welcome — say what you know and we will take it from there.")}
              </p>
              <div className="mt-6">
                <Button href="/rfq" variant="primary" className="w-full">
                  {p("Request a quotation")}
                </Button>
              </div>
              <p className="mt-4 text-[0.8125rem] text-steel-500">
                {p("Or email")}{" "}
                <a href={"mailto:" + contact.email} className="text-navy-900 underline decoration-steel-300 underline-offset-4 hover:decoration-brand-700">
                  {contact.email}
                </a>
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
                  <h3 className="font-display text-base font-semibold text-navy-900">{form.name}</h3>
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
            <p className="mt-4 text-[0.9375rem] text-steel-600">{compositionFootnote}</p>
          </div>
          <div className="mt-12 space-y-16">
            {tables.map((table) => (
              <CompositionTable
                key={table.slug}
                category={table}
                heading={tables.length > 1 ? table.name : undefined}
                id={tables.length > 1 ? "composition-" + table.slug : "composition"}
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
                    <SymbolBox symbol={item.symbol} />
                    <h3 className="font-display text-[1.0625rem] font-semibold leading-snug text-navy-900 transition-colors group-hover:text-brand-700">
                      {item.name}
                    </h3>
                  </div>
                  <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-steel-600">{p(item.accepts)}</p>
                  {item.threshold ? (
                    <span className="mt-4 font-mono text-[0.6875rem] text-brand-700">{item.threshold}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaSection
        title={p("Have {name} to place?", { name: family.name })}
        secondary={{ href: "/materials", label: p("Back to the portfolio") }}
      />

      <JsonLd
        data={[
          breadcrumbSchema(trail),
          materialSchema({
            name: family.name,
            description: family.accepts,
            slug: family.slug,
            image: family.images[0] ?? "/images/hero/turnings.jpg",
            gradeCount,
          }),
        ]}
      />
    </>
  );
}
