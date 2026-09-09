import type { ArticleBlock } from "@/types/content";

/**
 * Translatable content, keyed by the slug it belongs to.
 *
 * An overlay, not a replacement. The base data files stay exactly as they are —
 * critically the 295-grade composition tables, which must never be touched by
 * translation — and only the descriptive fields around them are swapped.
 *
 * What is deliberately absent: grade designations, chemical symbols, element
 * columns, composition values and standards references. Those are international
 * notation. "Inconel 718" is a name, not a phrase, and Ni is Ni in every
 * language.
 *
 * A locale may supply as much or as little as it has; anything missing falls
 * back to English, so a partial translation degrades to readable rather than to
 * a blank label.
 */
export interface CategoryContent {
  name: string;
  summary: string;
  properties: string[];
  applications: string[];
}

export interface IndustryContent {
  name: string;
  strapline: string;
  intro: string;
  capabilities: { title: string; body: string }[];
}

export interface ArticleContent {
  title: string;
  standfirst: string;
  description: string;
  body: ArticleBlock[];
}

export interface ContentPack {
  /** Alloy category slug → descriptive fields. Grade names are not included. */
  categories: Record<string, Partial<CategoryContent>>;
  industries: Record<string, Partial<IndustryContent>>;
  /** Recovery stream slug → its display name and physical form. */
  streams: Record<string, { name?: string; form?: string }>;
  tungstenForms: Record<string, { name?: string; note?: string }>;
  /** Process step number ("01"…"06") → title and body. */
  process: Record<string, { title?: string; body?: string }>;
  articles: Record<string, Partial<ArticleContent>>;
}
