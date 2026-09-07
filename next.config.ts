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

const MATERIAL_SLUGS = [
  "nickel-alloys",
  "tungsten-alloys",
  "stainless-steel",
  "complex-nickel-alloys",
  "nickel-copper",
  "high-speed-steels",
  "cobalt-alloys",
  "copper-nickel-alloys",
  "tool-steels",
  "cobalt-iron-alloys",
  "alloy-irons",
  "titanium-alloys",
  "nickel-iron-alloys",
  "magnet-alloys",
  "zirconium-alloys",
];

/** Legacy path -> new path. Registered with and without a trailing slash. */
const LEGACY_MAP: [string, string][] = [
  ...MATERIAL_SLUGS.map((slug): [string, string] => [`/${slug}`, `/materials/${slug}`]),
  ["/metals-alloys", "/materials"],
  ["/metals-and-waste-recovery", "/recycling"],
  ["/tungsten-carbide-recycling", "/recycling/tungsten"],
  ["/industries-served", "/industries"],
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
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [64, 96, 128, 200, 256, 384],
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
    ];
  },
};

export default nextConfig;
