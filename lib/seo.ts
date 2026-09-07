import type { Metadata } from "next";
import { site } from "./site";

interface PageMetaInput {
  title: string;
  description: string;
  /** Site-root-relative path, e.g. "/materials/nickel-alloys". */
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
  /** Use the title verbatim, without the " | IMS Metals & Alloys" suffix. */
  titleAbsolute?: boolean;
}

export const DEFAULT_OG_IMAGE = "/images/hero/turnings.jpg";

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

/**
 * Builds page metadata with a canonical URL and Open Graph/Twitter cards.
 * Titles are composed against the layout template, so pass the bare page title.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  noIndex = false,
  titleAbsolute = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: "en_GB",
      /* Dimensions are deliberately not declared: each page supplies its own
         photograph at its own aspect ratio, so a hardcoded 1200x630 would be
         wrong for most of them. Scrapers read the real size from the file. */
      images: [{ url: absoluteUrl(image), alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}
