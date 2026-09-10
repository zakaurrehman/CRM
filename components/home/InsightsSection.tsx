import { getLocale, getP } from "@/lib/i18n/server";
import { localiseArticle } from "@/lib/i18n/content";
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

      {/*
        No photography. The articles are about certification, standards and
        supply chains, and the library holds scrap yards and excavators — there
        is no image here that illustrates a compliance piece, and a generic one
        would decorate rather than inform. On a technical site that reads as
        filler, which is the same fault the alloy cards had.
      */}
      <ul className="mt-10 border-t border-steel-200">
        {[lead, ...rest].map((article) => (
          <li key={article.slug}>
            <Link
              href={"/insights/" + article.slug}
              className="group flex flex-col gap-2 border-b border-steel-200 py-6 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <p className="flex shrink-0 items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500 sm:w-44">
                <time dateTime={article.published}>
                  {formatDate(article.published, localeMeta[locale].tag)}
                </time>
                <span aria-hidden className="h-px w-4 bg-steel-300" />
                <span className="whitespace-nowrap">{p("{n} min read", { n: article.readingMinutes })}</span>
              </p>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[1.0625rem] font-semibold leading-snug tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
                  {article.title}
                </h3>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-steel-600">{article.standfirst}</p>
              </div>

              <span
                aria-hidden
                className="hidden shrink-0 self-center text-steel-500 transition-all duration-300 ease-swift group-hover:translate-x-0.5 group-hover:text-brand-700 sm:block"
              >
                <span className="dir-arrow">&rarr;</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
