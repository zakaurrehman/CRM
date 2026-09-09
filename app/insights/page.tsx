import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { CtaSection } from "@/components/shared/CtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { articlesByDate } from "@/data/insights";
import { formatDate } from "@/lib/utils";

const trail = [
  { name: "Home", href: "/" },
  { name: "Insights", href: "/insights" },
];

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Articles from IMS Metals & Alloys on metal recovery, industry standards and the role of specialist alloys in global supply chains.",
  path: "/insights",
  image: "/images/news/sustainable-metal-recovery.jpg",
});

export default function InsightsPage() {
  const [lead, ...rest] = articlesByDate;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Perspective from the material chain"
        intro="Notes on metal recovery, material standards and the alloys that global industry depends on."
        trail={trail}
      />

      {lead ? (
        <Section tone="white">
          <article>
            <Link href={"/insights/" + lead.slug} className="group grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="relative aspect-[16/10] overflow-hidden bg-steel-100 lg:col-span-7">
                <Image
                  src={lead.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.03]"
                />
              </div>
              <div className="lg:col-span-5 lg:self-center">
                <p className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
                  <span className="text-brand-700">Latest</span>
                  <span aria-hidden className="h-px w-6 bg-steel-300" />
                  <time dateTime={lead.published}>{formatDate(lead.published)}</time>
                </p>
                <h2 className="mt-5 font-display text-display-sm text-navy-900 transition-colors group-hover:text-brand-700">
                  {lead.title}
                </h2>
                <p className="mt-5 content-en text-[1.0625rem] leading-relaxed text-steel-600">{lead.standfirst}</p>
                <span className="mt-7 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-brand-700">
                  Read article
                  <span aria-hidden className="transition-transform duration-200 ease-swift group-hover:translate-x-1">
                    <span className="dir-arrow">&rarr;</span>
                  </span>
                </span>
              </div>
            </Link>
          </article>
        </Section>
      ) : null}

      {rest.length > 0 ? (
        <Section tone="light">
          <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
            More insights
          </h2>
          <ul className="mt-8 grid grid-rule sm:grid-cols-2">
            {rest.map((article, i) => (
              <Reveal as="li" key={article.slug} delay={i * 70} className="bg-white">
                <Link href={"/insights/" + article.slug} className="group flex h-full flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden bg-steel-100">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-swift group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
                      <time dateTime={article.published}>{formatDate(article.published)}</time>
                      <span aria-hidden className="h-px w-5 bg-steel-300" />
                      <span>{article.readingMinutes} min read</span>
                    </p>
                    <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
                      {article.title}
                    </h3>
                    <p className="mt-3 flex-1 content-en text-[0.9375rem] leading-relaxed text-steel-600">
                      {article.standfirst}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaSection secondary={{ href: "/materials", label: "Explore materials" }} />

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
