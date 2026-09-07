import { site, contact } from "./site";
import { absoluteUrl } from "./seo";
import type { Article } from "@/types/content";

type Json = Record<string, unknown>;

/**
 * Organization schema. Only fields backed by audited site content are emitted —
 * no telephone, founding date or certification is asserted while those remain
 * unverified (see /docs/content-verification.md).
 */
export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/images/branding/ims-logo.png"),
    email: contact.email,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.countryCode,
    },
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.social.length ? { sameAs: contact.social.map((s) => s.href) } : {}),
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function articleSchema(article: Article): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: absoluteUrl(article.image),
    datePublished: article.published,
    dateModified: article.updated ?? article.published,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": `${site.url}#organization` },
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
  };
}

/**
 * Material category schema. Modelled as a ProductGroup because each page
 * documents a family of alloy grades rather than a single purchasable SKU.
 */
export function materialSchema(input: {
  name: string;
  description: string;
  slug: string;
  image: string;
  gradeCount: number;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: input.name,
    description: input.description,
    image: absoluteUrl(input.image),
    url: absoluteUrl(`/materials/${input.slug}`),
    brand: { "@id": `${site.url}#organization` },
    variesBy: "https://schema.org/material",
    hasVariant: { "@type": "QuantitativeValue", value: input.gradeCount, unitText: "alloy grades" },
  };
}

/** Renders a JSON-LD script tag. Data is generated server-side from typed inputs. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
