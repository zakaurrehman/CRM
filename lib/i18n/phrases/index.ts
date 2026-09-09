import type { Locale } from "../config";
import { ruPhrases } from "./ru";
import { frPhrases } from "./fr";
import { nlPhrases } from "./nl";
import { hePhrases } from "./he";

/**
 * Page prose, keyed by its English source.
 *
 * The site has close to three hundred sentences of section copy spread across
 * thirty-odd files. Inventing a key for each one produces a dictionary nobody
 * can read and a name nobody can guess, so these are keyed by the English text
 * itself — the gettext model.
 *
 * Three things fall out of that:
 *   - a missing translation renders the English, never a blank or a raw key
 *   - a translator receives a file of English → target with the context visible
 *   - adding a sentence to a page needs no key ceremony
 *
 * The trade is that editing the English wording orphans its translations. That
 * is the right failure: the page keeps working in every language, and the stale
 * entries surface in the coverage report rather than shipping as a wrong
 * translation of text that no longer exists.
 *
 * Short interface labels stay in dictionaries/ — those are reused across
 * components and benefit from a stable name.
 */
export type PhraseTable = Record<string, string>;

const tables: Record<Locale, PhraseTable> = {
  en: {},
  ru: ruPhrases,
  fr: frPhrases,
  nl: nlPhrases,
  he: hePhrases,
};

export type Phrase = (english: string, vars?: Record<string, string | number>) => string;

export function phraseFor(locale: Locale): Phrase {
  const table = tables[locale] ?? {};
  return (english, vars) => {
    let text = table[english] ?? english;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.split(`{${name}}`).join(String(value));
      }
    }
    return text;
  };
}

/** Every English source string a locale has a translation for. */
export function phraseCoverage(locale: Locale): number {
  return Object.keys(tables[locale] ?? {}).length;
}
