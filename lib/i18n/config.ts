/**
 * Locale configuration.
 *
 * Deliberately free of React and of any dictionary import, so both the blocking
 * pre-paint script and the provider can use it.
 *
 * Scope: this translates the interface — navigation, controls, form labels,
 * validation and system messages. The technical content does not move. Alloy
 * designations (Inconel 718), element symbols and composition figures are
 * international notation and must not be localised; category descriptions and
 * articles stay in English because a machine-grade translation of a material
 * specification is a liability, not a feature. See docs item 21.
 */
export const locales = ["en", "ru", "fr", "nl", "he"] as const;
export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Where the choice is remembered. Read by the pre-paint script and the provider. */
export const LOCALE_STORAGE_KEY = "ims.locale";
export const LOCALE_COOKIE = "ims_locale";

export interface LocaleMeta {
  /** Endonym — how speakers write the language themselves. */
  native: string;
  english: string;
  dir: "ltr" | "rtl";
  /** BCP 47 tag for the `lang` attribute. */
  tag: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { native: "English", english: "English", dir: "ltr", tag: "en-GB" },
  ru: { native: "Русский", english: "Russian", dir: "ltr", tag: "ru" },
  fr: { native: "Français", english: "French", dir: "ltr", tag: "fr" },
  nl: { native: "Nederlands", english: "Dutch", dir: "ltr", tag: "nl" },
  he: { native: "עברית", english: "Hebrew", dir: "rtl", tag: "he" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}
