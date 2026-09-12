import type { NextConfig } from "next";

/**
 * Redirect map preserving the legacy WordPress URL structure.
 *
 * Two deliberate choices here:
 *
 * 1. `statusCode: 301` rather than `permanent: true`, which would emit a 308. Both are
 *    permanent to search engines, but 301 is what the wider tooling ecosystem expects.
 *
 * 2. `skipTrailingSlashRedirect` disables Next's built-in trailing-slash normaliser so
 *    that our own rules run first. Every legacy URL ends in a slash (WordPress default),
 *    and without this each one would take two hops: 308 to strip the slash, then 301 to
 *    the new location. Each legacy path is therefore registered in both forms, and a
 *    catch-all normaliser at the end handles everything else.
 *
 * See /docs/migration-matrix.md.
 */

/**
 * Where each legacy material category lives now.
 *
 * The portfolio (data/portfolio.ts) claims eight of the fifteen source
 * categories and puts their tables on a family page; those slugs redirect to
 * the family in one hop, from both the WordPress URL and the interim
 * /materials/<slug> one. The seven it does not claim stay at
 * /materials/<slug> as reference and need only the WordPress redirect.
 *
 * Kept as a literal rather than derived from data/portfolio.ts: this file runs
 * at config time, before the path alias is available.
 */
const CATEGORY_TO_FAMILY: Record<string, string> = {
  "nickel-alloys": "high-nickel-alloys",
  "complex-nickel-alloys": "superalloys",
  "cobalt-alloys": "cobalt-alloys",
  "stainless-steel": "stainless-steel",
  "high-speed-steels": "hss-tool-steel",
  "tool-steels": "hss-tool-steel",
  "titanium-alloys": "titanium",
  "tungsten-alloys": "tungsten-moly",
};

const REFERENCE_SLUGS = [
  "nickel-copper",
  "copper-nickel-alloys",
  "cobalt-iron-alloys",
  "alloy-irons",
  "nickel-iron-alloys",
  "magnet-alloys",
  "zirconium-alloys",
];

/** Legacy path -> new path. Registered with and without a trailing slash. */
const LEGACY_MAP: [string, string][] = [
  ...Object.entries(CATEGORY_TO_FAMILY).flatMap(([slug, family]): [string, string][] =>
    slug === family
      ? [[`/${slug}`, `/materials/${family}`]]
      : [
          [`/${slug}`, `/materials/${family}`],
          [`/materials/${slug}`, `/materials/${family}`],
        ],
  ),
  ...REFERENCE_SLUGS.map((slug): [string, string] => [`/${slug}`, `/materials/${slug}`]),
  ["/metals-alloys", "/materials"],
  ["/about-us", "/about"],
  ["/contact-us", "/contact"],
  ["/blogs", "/insights"],
  ["/category/blog", "/insights"],
  // The legacy FAQ page was published but completely empty.
  ["/frequently-asked-questions", "/contact"],
  // Yoast local-SEO artefact with no equivalent.
  ["/locations.kml", "/contact"],
  [
    "/2024/09/the-essential-role-of-metals-in-modern-industries",
    "/insights/the-essential-role-of-metals-in-modern-industries",
  ],
  [
    "/2024/10/sustainable-metal-recovery-turning-waste-into-value",
    "/insights/sustainable-metal-recovery-turning-waste-into-value",
  ],
  [
    "/2024/10/meeting-industry-standards-with-ims-metals-alloys-ou",
    "/insights/meeting-industry-standards-with-ims-metals-alloys-ou",
  ],

  /*
   * Pages retired in the 2026-09 refocus (docs/refocus-plan.md). The
   * recycling, industries and quality pages described the previous business;
   * each goes to the page that now answers the same question.
   */
  ["/metals-and-waste-recovery", "/what-we-do"],
  ["/recycling", "/what-we-do"],
  ["/tungsten-carbide-recycling", "/materials/tungsten-moly"],
  ["/recycling/tungsten", "/materials/tungsten-moly"],
  ["/recycling/aerospace-reverts", "/materials/superalloys"],
  ["/industries-served", "/what-we-do"],
  ["/industries", "/what-we-do"],
  ["/industries/aerospace", "/materials/superalloys"],
  ["/industries/oil-and-gas", "/what-we-do"],
  ["/industries/industrial-gas-turbine", "/materials/superalloys"],
  ["/industries/technology-and-mobility", "/what-we-do"],
  ["/about/quality-and-compliance", "/about"],
  ["/about/sustainability", "/about"],
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    /* The two qualities the site uses: 72 for full-bleed backdrops, where the
       wash hides compression, and 78 for everything else. Next 16 refuses a
       quality that is not declared here; today it only warns. */
    qualities: [72, 78],
    deviceSizes: [400, 640, 828, 1200, 1600, 2048],
    imageSizes: [64, 96, 128, 256, 384],
  },
  async redirects() {
    const legacy = LEGACY_MAP.flatMap(([from, to]) => [
      { source: from, destination: to, statusCode: 301 as const },
      { source: `${from}/`, destination: to, statusCode: 301 as const },
    ]);

    return [
      ...legacy,
      // Any other dated WordPress permalink goes to the Insights index rather than a
      // guessed slug, so a stale link never lands on a 404.
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:slug*",
        destination: "/insights",
        statusCode: 301,
      },
      // Normalise every remaining trailing slash in a single hop.
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      /*
       * The locale is read from a cookie, so an HTML response is only valid for
       * the cookie that produced it.
       *
       * Next.js currently replaces Vary on RSC-rendered routes with its own
       * router values, so this does not survive on most pages — verified
       * against a running build. What actually prevents a shared cache from
       * handing a Russian visitor an English render is the Cache-Control those
       * pages already carry: `private, no-store`. This entry is kept so the
       * requirement is expressed where caching is configured, and so it applies
       * on any route where Next does not set Vary itself.
       *
       * Scoped away from static assets and images: those do not vary by cookie,
       * and making them appear to would cost the CDN a hit for every visitor.
       */
      {
        source: "/((?!_next/static|_next/image|images/).*)",
        headers: [{ key: "Vary", value: "Cookie" }],
      },
    ];
  },
};

export default nextConfig;
