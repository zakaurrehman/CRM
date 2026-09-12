import type { MetadataRoute } from "next";
import { alloyCategories } from "@/data/alloys";
import { portfolioFamilies } from "@/data/portfolio";
import { articles } from "@/data/insights";
import { claimedCategorySlugs } from "@/lib/portfolio";
import { site } from "@/lib/site";

/** Every indexable route. /search is excluded to match robots.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/what-we-do"), lastModified: now, changeFrequency: "yearly", priority: 0.9 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: url("/materials"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/materials/ferro-alloys"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/materials/finder"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/materials/compare"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: url("/rfq"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/insights"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
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

  const posts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: url(`/insights/${article.slug}`),
    lastModified: new Date(article.updated ?? article.published),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...core, ...families, ...reference, ...posts];
}
