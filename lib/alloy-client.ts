"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { AlloyGroup } from "@/types/content";
import { materialHref } from "./portfolio";
import type { ElementThresholds, QueryableGrade } from "./alloy-query";

/**
 * Browser-side access to the parsed catalogue, plus the two small pieces of
 * state that outlive a single page: the comparison tray and saved materials.
 *
 * Nothing here imports the alloy tables. The index arrives over the network
 * from /api/alloy-index, once per session, shared by every component that asks.
 */

export interface ClientCategory {
  slug: string;
  name: string;
  group: AlloyGroup;
  properties: string[];
  applications: string[];
  image: string;
  gradeCount: number;
}

export interface ClientGrade extends QueryableGrade {
  id: string;
  name: string;
  category: string;
  anchor: string;
  href: string;
  compounds?: string[];
  composition: { element: string; pct: number; max: boolean; derived?: boolean }[];
}

export interface AlloyIndex {
  categories: ClientCategory[];
  categoryBySlug: Map<string, ClientCategory>;
  elements: { symbol: string; name: string; count: number }[];
  elementNames: Record<string, string>;
  thresholds: ElementThresholds;
  grades: ClientGrade[];
  gradeById: Map<string, ClientGrade>;
}

type RawPayload = {
  categories: ClientCategory[];
  elements: { symbol: string; name: string; count: number }[];
  elementNames: Record<string, string>;
  thresholds: ElementThresholds;
  grades: {
    id: string;
    name: string;
    category: string;
    anchor: string;
    composition: [string, number, number, number][];
    compounds?: string[];
  }[];
};

let cache: AlloyIndex | null = null;
let inFlight: Promise<AlloyIndex> | null = null;

/** Fetches and expands the index. Concurrent callers share one request. */
export function loadAlloyIndex(): Promise<AlloyIndex> {
  if (cache) return Promise.resolve(cache);
  if (inFlight) return inFlight;

  inFlight = fetch("/api/alloy-index")
    .then((r) => {
      if (!r.ok) throw new Error(`alloy index: ${r.status}`);
      return r.json() as Promise<RawPayload>;
    })
    .then((raw) => {
      const categoryBySlug = new Map(raw.categories.map((c) => [c.slug, c]));
      const grades: ClientGrade[] = raw.grades.map((g) => {
        const category = categoryBySlug.get(g.category);
        return {
          id: g.id,
          name: g.name,
          category: g.category,
          anchor: g.anchor,
          href: `${materialHref(g.category, g.name)}#${g.anchor}`,
          categoryName: category?.name ?? g.category,
          categorySlug: g.category,
          group: category?.group ?? "nickel",
          properties: category?.properties ?? [],
          applications: category?.applications ?? [],
          composition: g.composition.map(([element, pct, max, derived]) => ({
            element,
            pct,
            max: max === 1,
            derived: derived === 1 || undefined,
          })),
          compounds: g.compounds,
        };
      });
      cache = {
        categories: raw.categories,
        categoryBySlug,
        elements: raw.elements,
        elementNames: raw.elementNames,
        thresholds: raw.thresholds,
        grades,
        gradeById: new Map(grades.map((g) => [g.id, g])),
      };
      return cache;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function useAlloyIndex(): { index: AlloyIndex | null; error: string | null } {
  const [index, setIndex] = useState<AlloyIndex | null>(cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) {
      setIndex(cache);
      return;
    }
    let live = true;
    loadAlloyIndex()
      .then((i) => live && setIndex(i))
      .catch(() => live && setError("The material data could not be loaded. Please reload the page."));
    return () => {
      live = false;
    };
  }, []);

  return { index, error };
}

/* ------------------------------------------------------------------ *
 * Saved lists: the comparison tray and saved materials.
 *
 * Both are lists of grade ids in localStorage, shared across pages and tabs
 * through a tiny store so every mount of a save button reflects the same truth.
 * ------------------------------------------------------------------ */

const MAX_COMPARE = 4;

function makeListStore(key: string, limit?: number) {
  let value: string[] | null = null;
  const listeners = new Set<() => void>();

  const read = (): string[] => {
    if (value) return value;
    try {
      const stored = window.localStorage.getItem(key);
      value = stored ? (JSON.parse(stored) as string[]).filter((v) => typeof v === "string") : [];
    } catch {
      // Private mode, blocked storage, or corrupt JSON: behave as if empty.
      value = [];
    }
    return value;
  };

  const write = (next: string[]) => {
    value = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Nothing to do — the list still works for this page view.
    }
    listeners.forEach((l) => l());
  };

  return {
    key,
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        value = null;
        listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    get: read,
    has: (id: string) => read().includes(id),
    toggle(id: string) {
      const current = read();
      if (current.includes(id)) write(current.filter((v) => v !== id));
      else if (!limit || current.length < limit) write([...current, id]);
      return read();
    },
    remove(id: string) {
      write(read().filter((v) => v !== id));
    },
    add(ids: string[]) {
      const current = read();
      const merged = [...current];
      for (const id of ids) {
        if (merged.includes(id)) continue;
        if (limit && merged.length >= limit) break;
        merged.push(id);
      }
      write(merged);
    },
    clear() {
      write([]);
    },
    full: () => Boolean(limit) && read().length >= limit!,
    limit,
  };
}

export const compareStore = makeListStore("ims.compare", MAX_COMPARE);
export const savedStore = makeListStore("ims.saved");

const EMPTY: string[] = [];

/** Subscribes to one of the stores. Returns [] during SSR so markup matches. */
export function useList(store: ReturnType<typeof makeListStore>): string[] {
  return useSyncExternalStore(store.subscribe, store.get, () => EMPTY);
}

export function useCompare() {
  const ids = useList(compareStore);
  return {
    ids,
    has: useCallback((id: string) => ids.includes(id), [ids]),
    toggle: useCallback((id: string) => compareStore.toggle(id), []),
    remove: useCallback((id: string) => compareStore.remove(id), []),
    clear: useCallback(() => compareStore.clear(), []),
    full: ids.length >= MAX_COMPARE,
    max: MAX_COMPARE,
  };
}

export function useSaved() {
  const ids = useList(savedStore);
  return {
    ids,
    has: useCallback((id: string) => ids.includes(id), [ids]),
    toggle: useCallback((id: string) => savedStore.toggle(id), []),
    remove: useCallback((id: string) => savedStore.remove(id), []),
    clear: useCallback(() => savedStore.clear(), []),
  };
}

/** Formats a composition figure the way the tables do — "Bal." is never a number. */
export function formatAmount(amount: { pct: number; max: boolean; derived?: boolean }): string {
  if (amount.derived) return "Bal.";
  return amount.max ? `${amount.pct} max` : String(amount.pct);
}
