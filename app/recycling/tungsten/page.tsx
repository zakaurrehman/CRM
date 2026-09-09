import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { tungstenForms, tungstenMaterials } from "@/data/recovery";
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseTungstenForm } from "@/lib/i18n/content";

const trail = [
  { name: "Home", href: "/" },
  { name: "Recycling", href: "/recycling" },
  { name: "Tungsten Recycling", href: "/recycling/tungsten" },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Tungsten Recycling"),
  description:
    p("Tungsten recycled in all forms — carbide, Densalloy, CP-W, powder and heavy metals — from almost any scrap or production waste."),
  path: "/recycling/tungsten",
  image: "/images/tungsten/densalloy.jpg",
});
}

const whyIms = [
  {
    title: "Every form of arising",
    body: "Solid tooling, inserts, rolls and crucibles through to swarf, grinding sludge and loose powder. Tungsten rarely arrives clean, and each form needs a different route.",
  },
  {
    title: "Powder processing experience",
    body: "The same metallurgical and metal-powder capability we apply to dusts and filtercakes handles fine tungsten-bearing residues that are otherwise written off.",
  },
  {
    title: "Identified before it is priced",
    body: "Tungsten scrap varies widely in grade and binder content. Material is analysed so the offer reflects what is actually recoverable.",
  },
];

export default async function TungstenPage() {
  const p = await getP();
  const locale = await getLocale();
  const forms = tungstenForms.map((f) => localiseTungstenForm(f, locale));

  return (
    <>
      <PageHero
        eyebrow={p("Recycling & recovery")}
        title={p("Tungsten recycling")}
        intro={p("We specialise in recycling tungsten in all forms, including tungsten carbide, Densalloy, CP-W, tungsten powder and heavy metals. We are able to handle tungsten from almost all forms of tungsten scrap and production waste.")}
        trail={trail}
        image="/images/tungsten/swarf-bulk.jpg"
        imageAlt=""
      >
        <ul className="flex flex-wrap gap-2">
          {tungstenMaterials.map((material) => (
            <li key={material}>
              <Badge tone="onDark" className="px-3 py-1.5">
                {material}
              </Badge>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section tone="white">
        <SectionHeader
          eyebrow={p("Forms we handle")}
          title={p("Tungsten arrives in more shapes than any other metal we take.")}
          description={p("From indexable inserts and mining bits to grinding sludge and furnace crucibles — each of these is a distinct stream with its own recovery route.")}
          align="split"
        />

        <ul className="mt-14 grid grid-rule sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form, i) => (
            <Reveal as="li" key={form.slug} delay={i * 60} id={"form-" + form.slug} className="group bg-white">
              <figure className="flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-steel-100">
                  <Image
                    src={form.image}
                    alt={form.name + " tungsten scrap"}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-navy-900">{form.name}</h3>
                  <p className="mt-2.5 text-[0.875rem] leading-relaxed text-steel-600">{p(form.note)}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="navy">
        <SectionHeader
          eyebrow={p("Why IMS")}
          title={p("Why we can take tungsten others turn away.")}
          align="split"
          className="[&_h2]:text-white"
        />
        <ul className="mt-14 grid gap-8 lg:grid-cols-3">
          {whyIms.map((reason, i) => (
            <Reveal as="li" key={p(reason.title)} delay={i * 80}>
              <div className="border-t border-white/15 pt-6">
                <h3 className="font-display text-xl font-semibold tracking-tight text-white">{p(reason.title)}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-400">{p(reason.body)}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaSection
        title={p("Send us your tungsten stream.")}
        body={p("Carbide, heavy metal, powder or sludge — tell us the form and the volume and we will confirm what we can take and what it is worth.")}
        primary={{ href: "/contact", label: "Discuss tungsten recycling" }}
        secondary={{ href: "/recycling", label: "All recovery streams" }}
      />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
