import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { phraseFor, type Phrase } from "./phrases";
import { ru } from "./dictionaries/ru";
import { fr } from "./dictionaries/fr";
import { nl } from "./dictionaries/nl";
import { he } from "./dictionaries/he";

const dictionaries: Record<Locale, Dictionary> = { en, ru, fr, nl, he };

/**
 * Server-side access to the active language.
 *
 * The middleware puts the locale on the request as `x-ims-locale`; everything
 * rendered on the server reads it from here. This is what makes the whole page
 * translate rather than only the parts that happen to be client components.
 */
export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get("x-ims-locale");
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}

export type Translate = <N extends keyof Dictionary>(
  namespace: N,
  key: keyof Dictionary[N],
  vars?: Record<string, string | number>,
) => string;

/**
 * `t` for server components, with the same signature the client hook uses, so a
 * string reads identically whichever side of the boundary it is written on.
 */
export async function getT(): Promise<Translate> {
  const dict = await getDictionary();
  return (namespace, key, vars) => {
    const table = dict[namespace] as Record<string, string>;
    const fallback = en[namespace] as Record<string, string>;
    let text = table?.[key as string] ?? fallback?.[key as string] ?? String(key);
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        text = text.split(`{${name}}`).join(String(replacement));
      }
    }
    return text;
  };
}

/**
 * Page prose for server components, keyed by its English source.
 *
 * Pairs with `getT` for short interface labels; see lib/i18n/phrases for why the
 * two are split.
 */
export async function getP(): Promise<Phrase> {
  return phraseFor(await getLocale());
}
