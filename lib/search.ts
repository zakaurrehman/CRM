import { alloyCategorySummaries } from "@/data/alloy-index";
import { recoveryStreams, tungstenForms } from "@/data/recovery";
import { industries } from "@/data/industries";
import { articles } from "@/data/insights";
import { normalise } from "./utils";

export type SearchKind = "grade" | "material" | "stream" | "tungsten" | "industry" | "article" | "page";

export interface SearchDoc {
  id: string;
  title: string;
  /** Short qualifier shown under the title, e.g. the parent category. */
  context: string;
  href: string;
  kind: SearchKind;
  /** Pre-normalised haystack. */
  haystack: string;
}

export const kindLabels: Record<SearchKind, string> = {
  grade: "Alloy grade",
  material: "Material",
  stream: "Recovery stream",
  tungsten: "Tungsten",
  industry: "Industry",
  article: "Insight",
  page: "Page",
};

const staticPages: { title: string; context: string; href: string; terms: string }[] = [
  { title: "About IMS", context: "Company", href: "/about", terms: "company history trading network partnerships" },
  {
    title: "Quality & Compliance",
    context: "Company",
    href: "/about/quality-and-compliance",
    terms: "metallurgical laboratory testing sampling traceability certification feed stock analysis",
  },
  {
    title: "Sustainability",
    context: "Company",
    href: "/about/sustainability",
    terms: "environmental compliance landfill circular economy primary mining recovery",
  },
  { title: "Materials directory", context: "Materials", href: "/materials", terms: "alloys grades composition search" },
  {
    title: "Metals & Waste Recovery",
    context: "Recycling",
    href: "/recycling",
    terms: "powders dusts sludges filtercake metallurgical metal powder processing",
  },
  {
    title: "Tungsten Recycling",
    context: "Recycling",
    href: "/recycling/tungsten",
    terms: "tungsten carbide densalloy cp-w heavy metals powder scrap production waste",
  },
  {
    title: "Aerospace Reverts",
    context: "Recycling",
    href: "/recycling/aerospace-reverts",
    terms: "engine teardown destruction llp rotating parts superalloy grading precious metal gold platinum rhenium",
  },
  { title: "Industries", context: "Industries", href: "/industries", terms: "sectors served aerospace oil gas turbine" },
  { title: "Insights", context: "Editorial", href: "/insights", terms: "news articles" },
  { title: "Contact IMS", context: "Contact", href: "/contact", terms: "enquiry inquiry quote request tallinn estonia email" },
];

/**
 * Flat search index built once at module scope.
 *
 * Grades carry their category name and element symbols so that a search for
 * "inconel", "718", "nickel" or "rhenium" all land somewhere sensible.
 */
export const searchIndex: SearchDoc[] = [
  ...alloyCategorySummaries.map((c) => ({
    id: "material:" + c.slug,
    title: c.name,
    context: c.gradeCount + " grades",
    href: "/materials/" + c.slug,
    kind: "material" as const,
    haystack: normalise(
      [c.name, c.summary, c.properties.join(" "), c.applications.join(" ")].join(" "),
    ),
  })),
  ...alloyCategorySummaries.flatMap((c) =>
    c.gradeNames.map((g) => ({
      id: "grade:" + c.slug + ":" + g,
      title: g,
      context: c.name,
      href: "/materials/" + c.slug + "#grade-" + normalise(g).replace(/ /g, "-"),
      kind: "grade" as const,
      haystack: normalise(g + " " + c.name + " " + c.applications.join(" ")),
    })),
  ),
  ...recoveryStreams.map((s) => ({
    id: "stream:" + s.slug,
    title: s.name,
    context: "Metals & Waste Recovery",
    href: "/recycling#stream-" + s.slug,
    kind: "stream" as const,
    haystack: normalise(s.name + " " + s.form + " recovery stream"),
  })),
  ...tungstenForms.map((t) => ({
    id: "tungsten:" + t.slug,
    title: t.name,
    context: "Tungsten Recycling",
    href: "/recycling/tungsten#form-" + t.slug,
    kind: "tungsten" as const,
    haystack: normalise(t.name + " " + t.note + " tungsten"),
  })),
  ...industries.map((i) => ({
    id: "industry:" + i.slug,
    title: i.name,
    context: "Industries",
    href: "/industries/" + i.slug,
    kind: "industry" as const,
    haystack: normalise(i.name + " " + i.strapline + " " + i.intro + " " + i.capabilities.map((c) => c.title).join(" ")),
  })),
  ...articles.map((a) => ({
    id: "article:" + a.slug,
    title: a.title,
    context: "Insight",
    href: "/insights/" + a.slug,
    kind: "article" as const,
    haystack: normalise(a.title + " " + a.standfirst + " " + a.description),
  })),
  ...staticPages.map((p) => ({
    id: "page:" + p.href,
    title: p.title,
    context: p.context,
    href: p.href,
    kind: "page" as const,
    haystack: normalise(p.title + " " + p.context + " " + p.terms),
  })),
];

/** Relevance ordering: exact title, then title prefix, then word-start, then anywhere. */
function score(doc: SearchDoc, q: string): number {
  const title = normalise(doc.title);
  if (title === q) return 0;
  if (title.startsWith(q)) return 1;
  if (title.includes(q)) return 2;
  if (doc.haystack.includes(" " + q)) return 3;
  if (doc.haystack.includes(q)) return 4;
  return Number.POSITIVE_INFINITY;
}

/** Ranks pages and materials slightly above the long tail of individual grades. */
const kindWeight: Record<SearchKind, number> = {
  page: 0,
  material: 0,
  industry: 0,
  stream: 0.2,
  tungsten: 0.2,
  article: 0.3,
  grade: 0.5,
};

export function searchSite(query: string, limit = 30): SearchDoc[] {
  const q = normalise(query);
  if (q.length < 2) return [];
  const hits: { doc: SearchDoc; rank: number }[] = [];
  for (const doc of searchIndex) {
    const s = score(doc, q);
    if (s !== Number.POSITIVE_INFINITY) hits.push({ doc, rank: s + kindWeight[doc.kind] });
  }
  hits.sort((a, b) => a.rank - b.rank || a.doc.title.length - b.doc.title.length);
  return hits.slice(0, limit).map((h) => h.doc);
}
