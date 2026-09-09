"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  dirOf,
  isLocale,
  localeMeta,
  type Locale,
} from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";
import { fr } from "./dictionaries/fr";
import { nl } from "./dictionaries/nl";
import { he } from "./dictionaries/he";

const dictionaries: Record<Locale, Dictionary> = { en, ru, fr, nl, he };

type Namespace = keyof Dictionary;

interface I18nValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (next: Locale) => void;
  t: <N extends Namespace>(
    namespace: N,
    key: keyof Dictionary[N],
    vars?: Record<string, string | number>,
  ) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Reads the stored choice. Falls back to English rather than guessing from Accept-Language. */
function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Private mode or blocked storage: English it is.
  }
  return DEFAULT_LOCALE;
}

/**
 * Interface translation.
 *
 * The URLs do not change with the language. Only the interface is translated —
 * the alloy data, category descriptions and articles stay in English — so a
 * per-locale URL would serve near-identical content and split its own ranking.
 * Keeping one canonical URL per page also leaves the legacy 301 map, the
 * sitemap and every existing link exactly as they are.
 *
 * The trade-off is that the server renders English and a non-English reader
 * sees the interface settle on the first client render. `dir` and `lang` are set
 * before paint by the script in the layout, so the *layout* never flips — only
 * the words change, and only once per page load.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Adopt the stored choice as early as the client can run.
  useEffect(() => {
    const stored = readStoredLocale();
    if (stored !== DEFAULT_LOCALE) setLocaleState(stored);
  }, []);

  // Keep the document in step, for assistive tech, hyphenation and bidi.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = localeMeta[locale].tag;
    root.dir = dirOf(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Non-fatal: the choice simply will not survive this session.
    }
    // Mirrored to a cookie so the pre-paint script can set `dir` without JS
    // storage access, and so a future server-rendered variant could read it.
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dict = dictionaries[locale];
    return {
      locale,
      dir: dirOf(locale),
      setLocale,
      t: (namespace, key, vars) => {
        const table = dict[namespace] as Record<string, string>;
        const fallback = en[namespace] as Record<string, string>;
        let text = table?.[key as string] ?? fallback?.[key as string] ?? String(key);
        if (vars) {
          for (const [name, replacement] of Object.entries(vars)) {
            text = text.split(`{${name}}`).join(String(replacement));
          }
        }
        return text;
      },
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Translation access.
 *
 * Returns English outside a provider rather than throwing: a component rendered
 * in isolation — a test, or a server component tree that never mounts the
 * provider — should still produce readable text.
 */
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  return {
    locale: DEFAULT_LOCALE,
    dir: "ltr",
    setLocale: () => {},
    t: (namespace, key, vars) => {
      const table = en[namespace] as Record<string, string>;
      let text = table?.[key as string] ?? String(key);
      if (vars) {
        for (const [name, replacement] of Object.entries(vars)) {
          text = text.split(`{${name}}`).join(String(replacement));
        }
      }
      return text;
    },
  };
}
