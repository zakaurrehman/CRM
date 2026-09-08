"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAlloyIndex, useSaved, useCompare, formatAmount } from "@/lib/alloy-client";
import { downloadCsv, gradesToCsv } from "@/lib/export";
import { Button, ButtonEl } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Saved materials.
 *
 * The list lives in this browser only — there is no account system, and adding
 * one to hold a shortlist would be a poor trade. That is stated plainly rather
 * than left for someone to discover when they open the site on another machine.
 */
export function SavedMaterials() {
  const { index, error } = useAlloyIndex();
  const saved = useSaved();
  const compare = useCompare();

  const grades = useMemo(
    () => (index ? saved.ids.map((id) => index.gradeById.get(id)).filter((g) => g !== undefined) : []),
    [index, saved.ids],
  );

  if (error) {
    return <p className="rounded-md border border-danger-500/30 bg-danger-50 px-5 py-4 text-[0.9375rem] text-danger-700">{error}</p>;
  }

  if (saved.ids.length === 0) {
    return (
      <div className="rounded-lg border border-steel-200 bg-white px-6 py-16 text-center">
        <h2 className="font-display text-xl font-semibold text-navy-900">No saved materials yet</h2>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-steel-600">
          Save a grade from any composition table or from the alloy finder and it will be kept here, ready to compare
          or send through as a quotation request.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/materials/finder">Open the alloy finder</Button>
          <Button href="/materials" variant="secondary">Browse categories</Button>
        </div>
      </div>
    );
  }

  if (!index) return <p className="text-[0.9375rem] text-steel-600">Loading composition data&hellip;</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9375rem] text-steel-700">
          <span className="font-semibold text-navy-900">{grades.length}</span>{" "}
          {grades.length === 1 ? "material" : "materials"} saved in this browser
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonEl type="button" variant="ghost" size="sm" onClick={saved.clear}>
            Clear all
          </ButtonEl>
          <ButtonEl
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => downloadCsv("ims-saved-materials.csv", gradesToCsv(grades, index.elements.map((e) => e.symbol)))}
          >
            Export CSV
          </ButtonEl>
          <Button href={`/rfq?grades=${encodeURIComponent(saved.ids.join(","))}`} size="sm">
            Request a quotation
          </Button>
        </div>
      </div>

      <ul className="mt-6 grid grid-rule sm:grid-cols-2 xl:grid-cols-3">
        {grades.map((grade) => {
          const inCompare = compare.has(grade.id);
          const blocked = !inCompare && compare.full;
          return (
            <li key={grade.id} className="flex flex-col bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-[1.0625rem] font-semibold leading-tight text-navy-900">
                    <Link href={grade.href} className="transition-colors hover:text-brand-700">
                      {grade.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-[0.8125rem] text-steel-500">{grade.categoryName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => saved.remove(grade.id)}
                  className="shrink-0 rounded px-2 py-1 text-[0.8125rem] font-medium text-steel-600 transition-colors hover:bg-steel-100 hover:text-danger-600"
                >
                  Remove
                </button>
              </div>

              <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                {grade.composition.slice(0, 5).map((c) => (
                  <div key={c.element} className="flex items-baseline gap-1.5">
                    <dt className="font-mono text-[0.6875rem] tracking-[0.1em] text-steel-500">{c.element}</dt>
                    <dd className="font-mono text-[0.8125rem] tabular-nums text-navy-900">{formatAmount(c)}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-auto flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => compare.toggle(grade.id)}
                  disabled={blocked}
                  aria-pressed={inCompare}
                  className={cn(
                    "text-[0.8125rem] font-medium transition-colors",
                    inCompare ? "text-brand-700" : "text-steel-600 hover:text-brand-700",
                    blocked && "cursor-not-allowed opacity-50",
                  )}
                  title={blocked ? `Comparison holds ${compare.max} grades.` : undefined}
                >
                  {inCompare ? "In comparison" : "Add to comparison"}
                </button>
                <Link href={grade.href} className="text-[0.8125rem] font-medium text-brand-700 hover:text-brand-900">
                  Full composition &rarr;
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[0.8125rem] leading-relaxed text-steel-500">
        Saved materials are stored in this browser only. They are not sent to IMS and will not follow you to another
        device &mdash; export the list or send it as a quotation request to keep it.
      </p>
    </div>
  );
}
