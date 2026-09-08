import { alloyCategories } from "@/data/alloys";
import { gradeIndex, elementsInUse, elementThresholds, elementNames } from "@/lib/alloy-data";

/**
 * The parsed catalogue, as one static JSON document.
 *
 * The finder, the comparison tool and the RFQ basket all need every grade's
 * composition in the browser. Passing that through an RSC payload would put
 * ~100 kB of chemistry into the HTML of pages that never open those tools, and
 * the existing split between data/alloys.ts and data/alloy-index.ts exists
 * precisely to stop that happening.
 *
 * So it is fetched on demand instead, once, and only by the pages that use it.
 * `force-static` means it is built once at deploy time and served from the edge
 * cache like any other asset — there is no per-request work.
 *
 * The shape is deliberately compact: composition rides as tuples rather than
 * objects, and everything shared across a category (properties, applications)
 * lives on the category rather than being repeated 295 times.
 */
export const dynamic = "force-static";

export function GET() {
  const payload = {
    /** [symbol, percentage, isMax, isDerived] */
    gradeFields: ["element", "pct", "max", "derived"],
    categories: alloyCategories.map((c) => ({
      slug: c.slug,
      name: c.name,
      group: c.group,
      properties: c.properties,
      applications: c.applications,
      image: c.image,
      gradeCount: c.grades.length,
    })),
    elements: elementsInUse.map((e) => ({ symbol: e.symbol, name: e.name, count: e.count })),
    elementNames,
    thresholds: elementThresholds,
    grades: gradeIndex.map((g) => ({
      id: g.id,
      name: g.name,
      category: g.categorySlug,
      anchor: g.href.split("#")[1],
      composition: g.composition.map((c) => [c.element, c.pct, c.max ? 1 : 0, c.derived ? 1 : 0]),
      compounds: g.compounds.length ? g.compounds : undefined,
    })),
  };

  return Response.json(payload, {
    headers: {
      // Immutable for a day, revalidated in the background for a week after.
      "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
