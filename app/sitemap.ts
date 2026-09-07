import type { MetadataRoute } from "next";
import { alloyCategories } from "@/data/alloys";
import { industries } from "@/data/industries";
import { articles } from "@/data/insights";
import { site } from "@/lib/site";

/** Every indexable route. /search is excluded to match robots.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: url("/about/quality-and-compliance"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/about/sustainability"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/materials"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/recycling"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/recycling/tungsten"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/recycling/aerospace-reverts"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/industries"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/insights"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  const materials: MetadataRoute.Sitemap = alloyCategories.map((category) => ({
    url: url(`/materials/${category.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const sectors: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: url(`/industries/${industry.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const posts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: url(`/insights/${article.slug}`),
    lastModified: new Date(article.updated ?? article.published),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...core, ...materials, ...sectors, ...posts];
}
