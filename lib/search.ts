import { alloyCategorySummaries } from "@/data/alloy-index";
import { portfolioFamilies } from "@/data/portfolio";
import { tungstenForms } from "@/data/recovery";
import { articles } from "@/data/insights";
import { claimedCategorySlugs, groupOf, materialHref } from "./portfolio";
import { normalise } from "./utils";

export type SearchKind = "family" | "grade" | "material" | "tungsten" | "article" | "page";

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
  family: "Portfolio",
  grade: "Alloy grade",
  material: "Grade reference",
  tungsten: "Tungsten form",
  article: "Insight",
  page: "Page",
};

const staticPages: { title: string; context: string; href: string; terms: string }[] = [
  {
    title: "What we do",
    context: "Company",
    href: "/what-we-do",
    terms: "blending program ni-based blends complex scrap off-spec off-grade downgrading refiners alloy producers stainless",
  },
  { title: "About IMS", context: "Company", href: "/about", terms: "company tallinn estonia registration eori advantage" },
  { title: "Portfolio", context: "Portfolio", href: "/materials", terms: "families materials what we buy blend supply" },
  {
    title: "Accepted forms",
    context: "Portfolio",
    href: "/materials#forms",
    terms: "solids turnings runnings grindings 3d powders dusts",
  },
  { title: "Alloy finder", context: "Grade reference", href: "/materials/finder", terms: "search by element composition" },
  { title: "Compare grades", context: "Grade reference", href: "/materials/compare", terms: "side by side" },
  { title: "Request a quotation", context: "Contact", href: "/rfq", terms: "rfq quote price sell buy" },
  { title: "Insights", context: "Editorial", href: "/insights", terms: "news articles" },
  { title: "Contact IMS", context: "Contact", href: "/contact", terms: "enquiry inquiry tallinn estonia email whatsapp" },
];

/**
 * Flat search index built once at module scope.
 *
 * Families lead. Grades carry their category name so a search for "inconel",
 * "718" or "stellite" lands on the family page that holds the table, at the
 * grade's own anchor. The legacy categories the portfolio does not claim are
 * indexed as reference, so nothing that used to be findable has vanished.
 */
export const searchIndex: SearchDoc[] = [
  ...portfolioFamilies.map((f) => ({
    id: "family:" + f.slug,
    title: f.name,
    context: groupOf(f).name,
    href: "/materials/" + f.slug,
    kind: "family" as const,
    haystack: normalise([f.name, f.accepts, f.detail ?? "", (f.also ?? []).join(" "), groupOf(f).name].join(" ")),
  })),
  ...alloyCategorySummaries
    .filter((c) => !claimedCategorySlugs.has(c.slug))
    .map((c) => ({
      id: "material:" + c.slug,
      title: c.name,
      context: c.gradeCount + " grades · reference",
      href: "/materials/" + c.slug,
      kind: "material" as const,
      haystack: normalise([c.name, c.summary, c.properties.join(" "), c.applications.join(" ")].join(" ")),
    })),
  ...alloyCategorySummaries.flatMap((c) =>
    c.gradeNames.map((g) => ({
      id: "grade:" + c.slug + ":" + g,
      title: g,
      context: c.name,
      href: materialHref(c.slug, g) + "#grade-" + normalise(g).replace(/ /g, "-"),
      kind: "grade" as const,
      haystack: normalise(g + " " + c.name + " " + c.applications.join(" ")),
    })),
  ),
  ...tungstenForms.map((t) => ({
    id: "tungsten:" + t.slug,
    title: t.name,
    context: "Tungsten & Moly",
    href: "/materials/tungsten-moly#form-" + t.slug,
    kind: "tungsten" as const,
    haystack: normalise(t.name + " " + t.note + " tungsten"),
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
  family: 0,
  page: 0,
  material: 0.2,
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
