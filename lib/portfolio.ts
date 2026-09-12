import {
  portfolioFamilies,
  portfolioGroups,
  type PortfolioFamily,
  type PortfolioGroup,
  type PortfolioGroupId,
} from "@/data/portfolio";

/**
 * Lookups over the portfolio, free of any composition-table import so the
 * client can use them. lib/alloy-client.ts builds grade links in the browser,
 * and those links have to land on the family page a legacy category now sits
 * under rather than on the category itself.
 */

export const familyBySlug = new Map(portfolioFamilies.map((f) => [f.slug, f]));

export const groupById = new Map(portfolioGroups.map((g) => [g.id, g]));

export function familiesInGroup(group: PortfolioGroupId): PortfolioFamily[] {
  return portfolioFamilies.filter((f) => f.group === group);
}

export function groupOf(family: PortfolioFamily): PortfolioGroup {
  return groupById.get(family.group)!;
}

/**
 * The family whose page carries a legacy category's table.
 *
 * Where a category is split across families — the source "Complex Nickel
 * Alloys" table holds both the superalloys and the four Maraging grades — a
 * grade name resolves to the family holding that grade, and the bare category
 * resolves to the family that takes the table's remainder.
 */
export function familyForCategory(categorySlug: string, gradeName?: string): PortfolioFamily | undefined {
  const holders = portfolioFamilies.filter((f) => f.tables.some((t) => t.category === categorySlug));
  if (holders.length === 0) return undefined;
  if (gradeName) {
    for (const family of holders) {
      const ref = family.tables.find((t) => t.category === categorySlug)!;
      if (ref.only && ref.only.includes(gradeName)) return family;
      if (ref.except && ref.except.includes(gradeName)) continue;
      if (!ref.only) return family;
    }
  }
  return holders.find((f) => !f.tables.find((t) => t.category === categorySlug)!.only) ?? holders[0];
}

/**
 * Where a legacy category lives now: its family page if the portfolio claims
 * it, otherwise its own reference page at the URL it always had.
 */
export function materialHref(categorySlug: string, gradeName?: string): string {
  const family = familyForCategory(categorySlug, gradeName);
  return family ? `/materials/${family.slug}` : `/materials/${categorySlug}`;
}

/** Legacy categories the portfolio claims, so the rest can be listed as reference. */
export const claimedCategorySlugs = new Set(
  portfolioFamilies.flatMap((f) => f.tables.map((t) => t.category)),
);
