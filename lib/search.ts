import { alloyCategorySummaries } from "@/data/alloy-index";
import { portfolioFamilies, ferroAlloys, intermediates } from "@/data/portfolio";
import { tungstenForms } from "@/data/recovery";
import { claimedCategorySlugs, groupOf, materialHref } from "./portfolio";
import { routes } from "./site";
import { normalise } from "./utils";
import { translationsOf } from "./i18n/phrases";

export type SearchKind = "family" | "grade" | "material" | "tungsten" | "page";

export interface SearchDoc {
  id: string;
  title: string;
  /**
   * Shown before the title and never translated: a formula or symbol, "APT".
   * Kept out of the title so the title alone is the translation key.
   */
  prefix?: string;
  /** Short qualifier shown under the title, e.g. the parent category. */
  context: string;
  href: string;
  kind: SearchKind;
  /** Pre-normalised haystack. */
  haystack: string;
}

/**
 * Quick searches offered before anything is typed. Designations stay as they
 * are; words are shown, and searched, in the visitor's language.
 */
export const searchSuggestions = ["Inconel 718", "Stellite", "Tungsten", "FeNiCr", "APT"];

export const kindLabels: Record<SearchKind, string> = {
  family: "Portfolio",
  grade: "Alloy grade",
  material: "Grade reference",
  tungsten: "Tungsten form",
  page: "Page",
};

const staticPages: { title: string; context: string; href: string; terms: string }[] = [
  {
    title: "What we do",
    context: "Company",
    href: "/what-we-do",
    terms: "blending programme nickel-based blends complex mixed off-spec materials downgrading refiners alloy producers stainless mills processing network laboratories",
  },
  { title: "About IMS", context: "Company", href: "/about", terms: "company tallinn estonia registration eori operating model network" },
  { title: "Portfolio", context: "Portfolio", href: "/materials", terms: "materials what we buy blend supply" },
  {
    title: "Accepted forms",
    context: "Portfolio",
    href: "/materials#forms",
    terms: "solids turnings swarf runners risers gates grindings fines microgranules am 3d powders dusts filter cake process residues",
  },
  { title: "Alloy finder", context: "Grade reference", href: "/materials/finder", terms: "search by element composition" },
  { title: "Compare grades", context: "Grade reference", href: "/materials/compare", terms: "side by side" },
  { title: "Contact IMS", context: "Contact", href: "/contact", terms: "enquiry inquiry tallinn estonia email whatsapp" },
  { title: "Privacy policy", context: "Legal", href: routes.privacy, terms: "personal data gdpr cookies uploaded files controller" },
  { title: "Legal information", context: "Legal", href: routes.legal, terms: "company registration eori disclaimer trademarks governing law" },
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
    haystack: normalise([f.symbol, f.name, f.accepts, f.detail ?? "", groupOf(f).name].join(" ")),
  })),
  {
    id: "family:ferro-alloys",
    title: "Ferroalloys",
    context: "Portfolio",
    href: "/materials/ferro-alloys",
    kind: "family" as const,
    haystack: normalise("ferro alloys ferroalloys " + ferroAlloys.map((a) => a.mark + " " + a.name).join(" ")),
  },
  ...ferroAlloys.map((a) => ({
    id: "ferro:" + a.mark,
    title: a.mark,
    context: a.name,
    href: "/materials/ferro-alloys#" + a.mark.toLowerCase(),
    kind: "family" as const,
    haystack: normalise(a.mark + " " + a.name + " ferro alloy"),
  })),
  ...intermediates.flatMap((g) =>
    g.items.map((item) => ({
      id: "intermediate:" + g.metal + ":" + item.name,
      title: item.name,
      prefix: item.formula,
      context: "Powders, oxides & intermediates",
      href: g.family ? "/materials/" + g.family : routes.intermediates,
      kind: "family" as const,
      haystack: normalise([item.formula ?? "", item.name, g.metal, g.symbol ?? "", "powder oxide intermediate"].join(" ")),
    })),
  ),
  ...alloyCategorySummaries
    .filter((c) => !claimedCategorySlugs.has(c.slug))
    .map((c) => ({
      id: "material:" + c.slug,
      title: c.name,
      context: "Grade reference",
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
    context: "Tungsten",
    href: "/materials/tungsten#form-" + t.slug,
    kind: "tungsten" as const,
    haystack: normalise(t.name + " " + t.note + " tungsten"),
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

/* Translated names join the haystack, so a visitor searching in their own
   language finds the page — "вольфрам" finds Tungsten. Grade designations read
   the same in every language and are left as they are. */
for (const doc of searchIndex) {
  if (doc.kind === "grade") continue;
  const translated = [...translationsOf(doc.title), ...translationsOf(doc.context)];
  if (translated.length) doc.haystack += " " + normalise(translated.join(" "));
}

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
