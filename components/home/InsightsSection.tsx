import { getLocale, getP } from "@/lib/i18n/server";
import { localiseArticle } from "@/lib/i18n/content";
import Image from "next/image";
import Link from "next/link";
import { articlesByDate } from "@/data/insights";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { localeMeta } from "@/lib/i18n/config";

/**
 * Editorial layout: one lead article at full bleed with the rest as a ruled
 * index beside it, rather than three equal-weight cards.
 */
export async function InsightsSection() {
  const p = await getP();
  const locale = await getLocale();

  // Titles and standfirsts live in the content overlay, keyed by slug.
  const [lead, ...rest] = articlesByDate.map((a) => localiseArticle(a, locale));
  if (!lead) return null;

  return (
    <Section tone="white">
      <SectionHeader
        eyebrow={p("Insights")}
        title={p("Perspective from the material chain.")}
        align="split"
        action={
          <Button href="/insights" variant="secondary">{p("All insights")}</Button>
        }
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <article className="lg:col-span-7">
          <Link href={"/insights/" + lead.slug} className="group block">
            <div className="relative aspect-[16/9] overflow-hidden bg-steel-100">
              <Image
                src={lead.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-6">
              <p className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
                <time dateTime={lead.published}>{formatDate(lead.published, localeMeta[locale].tag)}</time>
                <span aria-hidden className="h-px w-6 bg-steel-300" />
                <span>{p("{n} min read", { n: lead.readingMinutes })}</span>
              </p>
              <h3 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-navy-900 transition-colors group-hover:text-brand-700 lg:text-[2rem]">
                {lead.title}
              </h3>
              <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-steel-600">{lead.standfirst}</p>
            </div>
          </Link>
        </article>

        <div className="lg:col-span-4 lg:col-start-9">
          <ul className="border-t border-steel-200">
            {rest.map((article) => (
              <li key={article.slug}>
                <Link href={"/insights/" + article.slug} className="group flex gap-5 border-b border-steel-200 py-6">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
                      <time dateTime={article.published}>{formatDate(article.published, localeMeta[locale].tag)}</time>
                    </p>
                    <h3 className="mt-2.5 font-display text-lg font-semibold leading-snug tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[0.875rem] leading-relaxed text-steel-600">
                      {article.standfirst}
                    </p>
                  </div>
                  <div className="relative hidden h-20 w-24 shrink-0 overflow-hidden bg-steel-100 sm:block">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 ease-swift group-hover:scale-105"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
