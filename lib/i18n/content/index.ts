import type { Locale } from "../config";
import type { ContentPack } from "./types";
import { enContent } from "./en";
import { ruContent } from "./ru";
import { frContent } from "./fr";
import { nlContent } from "./nl";
import { heContent } from "./he";

const packs: Record<Locale, ContentPack> = {
  en: enContent,
  ru: ruContent,
  fr: frContent,
  nl: nlContent,
  he: heContent,
};

export function contentFor(locale: Locale): ContentPack {
  return packs[locale] ?? enContent;
}

/**
 * Localised view of a record, falling back field by field.
 *
 * Field-level rather than record-level: a locale that has translated a
 * category's summary but not yet its applications should show the translated
 * summary and the English applications, not lose both. Partial translations
 * degrade to readable.
 */
function merge<T extends object>(base: T, overlay: Partial<T> | undefined): T {
  if (!overlay) return base;
  const out = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === "string" && !value.trim()) continue;
    (out as Record<string, unknown>)[key] = value;
  }
  return out;
}

export function localiseCategory<T extends { slug: string }>(category: T, locale: Locale): T {
  return merge(category, contentFor(locale).categories[category.slug] as Partial<T>);
}

export function localiseTungstenForm<T extends { slug: string }>(form: T, locale: Locale): T {
  return merge(form, contentFor(locale).tungstenForms[form.slug] as Partial<T>);
}

export function localiseArticle<T extends { slug: string }>(article: T, locale: Locale): T {
  return merge(article, contentFor(locale).articles[article.slug] as Partial<T>);
}

export type { ContentPack } from "./types";

/**
 * Localised category name for an indexed grade.
 *
 * Indexed grades carry the slug, so the label can come from the same overlay
 * the category pages use rather than from a duplicated phrase entry.
 */
export function categoryNameFor(slug: string, fallback: string, locale: Locale): string {
  return contentFor(locale).categories[slug]?.name || fallback;
}
