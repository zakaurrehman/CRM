"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

/**
 * Reads the stored choice, or null when nothing is stored.
 *
 * Returning null rather than English matters: "no preference recorded" and
 * "English was chosen" are different states, and collapsing them made the client
 * override a Russian cookie with English on first render.
 */
function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    // Private mode or blocked storage: defer to the server.
    return null;
  }
}

/**
 * Translation for client components.
 *
 * The server is the source of truth: the middleware reads the language cookie,
 * the layout renders in that language, and this provider is seeded with the
 * same value. Client and server therefore agree from the first paint — there is
 * no moment where a translated heading sits above an English button.
 *
 * Changing language writes the cookie and calls router.refresh(), so the
 * server-rendered part of the page comes back translated too. Most of this site
 * is server components; without that refresh only the client islands would
 * change, which was the original fault.
 *
 * URLs do not change with language. One canonical path per page keeps the
 * legacy 301 map, the sitemap and every internal link untouched.
 */
export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  /**
   * Resolved on the server from the request cookie.
   *
   * Client components start on the same locale the server rendered, so there is
   * never a moment where a translated heading sits above an English button.
   */
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  /*
   * Reconcile with storage.
   *
   * Only an actual stored preference may override the server. Treating "nothing
   * stored" as "English chosen" made every fresh visit with a language cookie
   * render Russian on the server and then snap back to English on hydration —
   * the navbar-and-content mismatch this whole system exists to prevent.
   *
   * When storage is empty and the cookie is not English, the cookie is mirrored
   * into storage so the two agree from then on.
   */
  useEffect(() => {
    const stored = readStoredLocale();
    if (stored && stored !== initialLocale) {
      setLocaleState(stored);
      return;
    }
    if (!stored && initialLocale !== DEFAULT_LOCALE) {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale);
      } catch {
        // Non-fatal; the cookie still carries the choice.
      }
    }
  }, [initialLocale]);

  // Keep the document in step, for assistive tech, hyphenation and bidi.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = localeMeta[locale].tag;
    root.dir = dirOf(locale);
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        // Non-fatal: the choice simply will not survive this session.
      }
      /* The cookie is what the middleware reads, so it has to be written before
         the refresh below or the server would render the previous language. */
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;

      /* Most of the page is server-rendered, so switching language has to ask
         the server for it again. Without this the client components would
         translate and everything else would stay as it was — which is exactly
         the "Russian navigation, English page" this replaced. */
      router.refresh();
    },
    [router],
  );

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
