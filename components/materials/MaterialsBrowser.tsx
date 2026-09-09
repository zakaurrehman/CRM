"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { alloyGroupLabels, alloyGroupOrder } from "@/lib/navigation";
import { cn, normalise } from "@/lib/utils";
import type { AlloyCategorySummary, AlloyGroup } from "@/types/content";
import type { ElementShare } from "@/lib/alloy-profile";
import { SpecimenArt } from "./SpecimenArt";

type Filter = AlloyGroup | "all";

/**
 * Materials directory.
 *
 * Takes the slim category projection as a prop, so the browser never downloads
 * the composition tables just to render this index.
 *
 * Search runs across category names, element groups, applications and every
 * individual grade name, so a query like "718" or "Stellite" finds the category
 * that holds it. Matching grades are surfaced directly as deep links, which is
 * the fastest route for someone who already knows the grade they need.
 */
export function MaterialsBrowser({
  categories: all,
  profiles,
}: {
  categories: AlloyCategorySummary[];
  /* Passed in rather than imported: lib/alloy-profile reads the full
     composition tables, and this component runs in the browser. */
  profiles: Record<string, ElementShare[]>;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Filter>("all");

  const q = normalise(query);

  const { categories, gradeHits } = useMemo(() => {
    const byGroup = group === "all" ? all : all.filter((c) => c.group === group);
    if (!q) return { categories: byGroup, gradeHits: [] as { grade: string; category: string; href: string }[] };

    const categories = byGroup.filter((c) => {
      const haystack = normalise(
        [c.name, c.summary, c.properties.join(" "), c.applications.join(" ")].join(" "),
      );
      return haystack.includes(q) || c.gradeNames.some((g) => normalise(g).includes(q));
    });

    const gradeHits = byGroup
      .flatMap((c) =>
        c.gradeNames
          .filter((g) => normalise(g).includes(q))
          .map((g) => ({
            grade: g,
            category: c.name,
            href: "/materials/" + c.slug + "#grade-" + normalise(g).replace(/ /g, "-"),
          })),
      )
      .slice(0, 12);

    return { categories, gradeHits };
  }, [q, group, all]);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", all.length]]);
    for (const g of alloyGroupOrder) map.set(g, all.filter((c) => c.group === g).length);
    return map;
  }, [all]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-96">
          <label htmlFor="material-search" className="sr-only">
            Search materials and alloy grades
          </label>
          <div className="relative">
            <svg
              viewBox="0 0 18 18"
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500"
            >
              <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              id="material-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search grades, e.g. Inconel 718, Stellite, Nimonic"
              className="h-12 w-full rounded border border-steel-300 bg-white pl-10 pr-4 text-[0.9375rem] text-navy-900 transition-colors placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700"
            />
          </div>
        </div>

        <div className="scroll-x -mx-5 px-5 lg:mx-0 lg:px-0">
          <div role="group" aria-label="Filter by material group" className="flex w-max gap-2 pb-1 lg:w-auto">
            {(["all", ...alloyGroupOrder] as Filter[]).map((g) => {
              const selected = group === g;
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setGroup(g)}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded border px-3.5 text-[0.875rem] font-medium transition-colors",
                    selected
                      ? "border-brand-700 bg-brand-700 text-white"
                      : "border-steel-300 bg-white text-steel-700 hover:border-brand-700 hover:text-brand-700",
                  )}
                >
                  {g === "all" ? "All materials" : alloyGroupLabels[g]}
                  <span
                    className={cn(
                      "font-mono text-[0.6875rem] tabular-nums",
                      selected ? "text-white/90" : "text-steel-500",
                    )}
                  >
                    {counts.get(g)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {gradeHits.length > 0 ? (
        <div className="mt-8 rounded-md border border-brand-200 bg-brand-50/60 p-5">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-800">Matching grades</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {gradeHits.map((hit) => (
              <li key={hit.href}>
                <Link
                  href={hit.href}
                  className="inline-flex items-center gap-2 rounded-sm border border-brand-200 bg-white px-2.5 py-1.5 text-[0.8125rem] transition-colors hover:border-brand-700"
                >
                  <span className="font-medium text-navy-900">{hit.grade}</span>
                  <span className="text-steel-500">{hit.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Names the results region for assistive technology and keeps the heading
          order intact between the page h1 and the h3 on each card. */}
      <h2 className="sr-only">Material categories</h2>

      <p aria-live="polite" className="mt-8 text-[0.875rem] text-steel-500">
        {categories.length} {categories.length === 1 ? "category" : "categories"}
        {q ? <> matching &ldquo;{query}&rdquo;</> : null}
      </p>

      {/* The grid carries no outer border: filtering can leave the last row
          partly empty, and a frame around that gap draws the eye to nothing.
          The cell hairlines already give it structure, as elsewhere on the site. */}
      {categories.length > 0 ? (
        <ul className="mt-5 grid grid-rule sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <li key={category.slug} className="bg-white">
              <Link
                href={"/materials/" + category.slug}
                className="group flex h-full flex-col transition-colors hover:bg-steel-50"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-steel-100">
                  {category.cardArt === "specimen" ? (
                    <SpecimenArt
                      profile={profiles[category.slug] ?? []}
                      className="absolute inset-0 transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
                    />
                  ) : (
                    <>
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        priority={i < 3}
                        sizes="(min-width: 1280px) 24rem, (min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden
                        /* Deep enough at the foot to carry the count over a bright
                           photograph as well as a dark one — the pipes and the
                           aero-engine shots sit at opposite ends of that range. */
                        className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/10 to-transparent"
                      />
                    </>
                  )}
                  <span className="absolute bottom-3 left-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-white tabular-nums">
                    {category.gradeCount} grades
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
                    {category.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-steel-600">
                    {category.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {category.properties.slice(0, 3).map((property) => (
                      <li
                        key={property}
                        className="rounded-sm bg-steel-100 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-steel-600"
                      >
                        {property}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700">
                    View composition
                    <span
                      aria-hidden
                      className="transition-transform duration-200 ease-swift group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-md border border-steel-200 bg-steel-50 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-navy-900">No material matches that search</p>
          <p className="mx-auto mt-2 max-w-md text-[0.9375rem] text-steel-600">
            We handle a wider range than is listed here, including pure metals and ferro-alloys. Tell us what
            you are looking for and we will confirm whether we can source or recover it.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex h-11 items-center rounded bg-brand-700 px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-brand-800"
          >
            Ask about a material
          </Link>
        </div>
      )}
    </div>
  );
}
