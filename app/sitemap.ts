import type { MetadataRoute } from "next";
import { alloyCategories } from "@/data/alloys";
import { portfolioFamilies } from "@/data/portfolio";
import { claimedCategorySlugs } from "@/lib/portfolio";
import { routes, site } from "@/lib/site";

/**
 * Every indexable route. /search is excluded to match robots.ts; Insights
 * is offline (see next.config.ts) and the offer and supply forms are
 * unlisted — email is the one door (IMS, 14 September 2026) — so neither
 * is here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/what-we-do"), lastModified: now, changeFrequency: "yearly", priority: 0.9 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: url("/materials"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/materials/ferro-alloys"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url(routes.intermediates), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/materials/finder"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/materials/compare"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: url(routes.privacy), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: url(routes.legal), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const families: MetadataRoute.Sitemap = portfolioFamilies.map((family) => ({
    url: url(`/materials/${family.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  /* Legacy tables the portfolio does not claim, kept as reference. */
  const reference: MetadataRoute.Sitemap = alloyCategories
    .filter((c) => !claimedCategorySlugs.has(c.slug))
    .map((category) => ({
      url: url(`/materials/${category.slug}`),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    }));

  return [...core, ...families, ...reference];
}
