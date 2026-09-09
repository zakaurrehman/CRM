"use client";

import { useMemo } from "react";
import { useI18n } from "../provider";
import { phraseFor, type Phrase } from "./index";

/** Page prose for client components. Same contract as the server's `getP`. */
export function useP(): Phrase {
  const { locale } = useI18n();
  return useMemo(() => phraseFor(locale), [locale]);
}
