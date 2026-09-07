"use client";

import { useMemo, useState } from "react";
import { compositionFootnote } from "@/data/alloy-index";
import type { AlloyCategory } from "@/types/content";
import { cn, normalise } from "@/lib/utils";

/**
 * Chemical composition table.
 *
 * Layout notes:
 * - The grade column is sticky on every breakpoint, so a reader scrolled to the
 *   far right still knows which alloy the numbers belong to. This is what makes
 *   the table usable on a phone without reflowing it into cards and losing the
 *   ability to compare grades.
 * - The header row is sticky under the site header on tall tables.
 * - Values are unmodified source data. Blank cells mean the source table left
 *   the element unspecified and are exposed to assistive tech as such.
 */
export function CompositionTable({ category }: { category: AlloyCategory }) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = normalise(query);
    if (!q) return category.grades;
    return category.grades.filter((g) => normalise(g.name).includes(q));
  }, [category.grades, query]);

  const filtering = query.trim().length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-display-sm" id="composition">
            Chemical composition
          </h2>
          <p className="mt-2 text-[0.9375rem] text-steel-600">
            {category.grades.length} grades &middot; percentage by weight
          </p>
        </div>

        {category.grades.length > 8 ? (
          <div className="sm:w-72">
            <label htmlFor="grade-filter" className="sr-only">
              Filter {category.name} grades by name
            </label>
            <div className="relative">
              <svg
                viewBox="0 0 18 18"
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500"
              >
                <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                id="grade-filter"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter grades"
                className="h-11 w-full rounded border border-steel-300 bg-white pl-9 pr-3 text-[0.9375rem] text-navy-900 transition-colors placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700"
              />
            </div>
          </div>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only">
        {filtering ? `${rows.length} of ${category.grades.length} grades shown` : ""}
      </p>

      <div className="mt-6 overflow-hidden rounded-md border border-steel-200">
        <div className="scroll-x max-h-[min(70vh,44rem)] overflow-y-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              Nominal chemical composition of {category.name} grades handled by IMS, in percentage by weight.
              {" "}
              {compositionFootnote}
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-0 z-30 min-w-[13rem] border-b border-r border-steel-200 bg-steel-100 px-4 py-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-steel-600"
                >
                  Grade
                </th>
                {category.elements.map((el) => (
                  <th
                    key={el}
                    scope="col"
                    className={cn(
                      "sticky top-0 z-20 border-b border-steel-200 bg-steel-100 px-3 py-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-steel-600",
                      el === "Others" ? "min-w-[10rem] text-left" : "min-w-[4.25rem] text-right",
                    )}
                  >
                    {el}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((grade) => (
                <tr key={grade.name} id={"grade-" + normalise(grade.name).replace(/ /g, "-")} className="group">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-r border-steel-200 bg-white px-4 py-2.5 text-[0.875rem] font-medium text-navy-900 transition-colors group-hover:bg-brand-50"
                  >
                    {grade.name}
                  </th>
                  {grade.values.map((value, i) => (
                    <td
                      key={category.elements[i]}
                      className={cn(
                        "border-b border-steel-100 px-3 py-2.5 font-mono text-[0.8125rem] tabular-nums transition-colors group-hover:bg-brand-50/50",
                        category.elements[i] === "Others" ? "text-left text-steel-600" : "text-right",
                        value ? "text-steel-800" : "text-steel-500",
                      )}
                    >
                      {value || <span aria-label="not specified">&ndash;</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 ? (
          <p className="border-t border-steel-200 bg-steel-50 px-4 py-8 text-center text-sm text-steel-600">
            No grade matches &ldquo;{query}&rdquo;.{" "}
            <button type="button" onClick={() => setQuery("")} className="font-medium text-brand-700 hover:underline">
              Clear filter
            </button>
          </p>
        ) : null}
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-steel-500">
        {compositionFootnote} Values are reproduced from IMS technical data and are provided for
        identification purposes; confirm the specification against your own requirement before ordering.
      </p>
      <p className="mt-2 text-[0.8125rem] text-steel-500 sm:hidden">Scroll the table sideways to see all elements.</p>
    </div>
  );
}
