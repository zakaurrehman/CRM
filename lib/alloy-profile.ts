import { alloyCategories } from "@/data/alloys";
import type { AlloyCategory } from "@/types/content";
import { indexGrade } from "./alloy-data";

/**
 * What characterises a category, computed from its own grades.
 *
 * Used by the specimen cards that stand in for photography on the families IMS
 * has no photograph of. The numbers are derived from the published tables, not
 * written by hand, so a card cannot drift away from the data behind it.
 *
 * These are medians across the grades in a family, so they describe the family
 * rather than any single alloy — and they do not sum to 100. Anything rendering
 * them has to say so.
 *
 * Server-only: it reads the full composition tables.
 */
export interface ElementShare {
  element: string;
  /** Median percentage among the grades that contain it. */
  median: number;
  /** Proportion of the family's grades containing it, 0–1. */
  share: number;
}

export function categoryProfile(category: AlloyCategory, limit = 5): ElementShare[] {
  const grades = category.grades.map((grade) => indexGrade(category, grade));
  const byElement = new Map<string, number[]>();

  for (const grade of grades) {
    for (const amount of grade.composition) {
      byElement.set(amount.element, [...(byElement.get(amount.element) ?? []), amount.pct]);
    }
  }

  return [...byElement.entries()]
    .map(([element, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      return {
        element,
        median: sorted[Math.floor(sorted.length / 2)],
        share: values.length / grades.length,
      };
    })
    /* Present in at least half the family, otherwise it describes a few grades
       rather than the family. */
    .filter((e) => e.share >= 0.5)
    .sort((a, b) => b.median - a.median)
    .slice(0, limit);
}

export const categoryProfiles: Record<string, ElementShare[]> = Object.fromEntries(
  alloyCategories.map((category) => [category.slug, categoryProfile(category)]),
);
