"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAlloyIndex, useCompare, useSaved, formatAmount } from "@/lib/alloy-client";
import { downloadCsv, gradesToCsv } from "@/lib/export";
import { ButtonEl, Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Side-by-side composition comparison.
 *
 * Grades are the columns and elements the rows, which is the orientation a
 * metallurgist reads: you scan one element across the candidates. Only elements
 * that appear in at least one selected grade get a row, so comparing two
 * titanium alloys does not print fourteen empty nickel-alloy columns.
 *
 * Where grades differ on an element the row is marked, because the entire
 * purpose of the view is to find the differences. Rows identical across every
 * column are dimmed rather than hidden — an element being the same everywhere
 * is itself information.
 */
export function CompareTable() {
  const { index, error } = useAlloyIndex();
  const { ids, remove, clear } = useCompare();
  const saved = useSaved();

  const grades = useMemo(
    () => (index ? ids.map((id) => index.gradeById.get(id)).filter((g) => g !== undefined) : []),
    [index, ids],
  );

  const rows = useMemo(() => {
    if (grades.length === 0) return [];
    const order = index?.elements.map((e) => e.symbol) ?? [];
    const present = new Set<string>();
    for (const g of grades) for (const c of g.composition) present.add(c.element);

    return [...present]
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((element) => {
        const cells = grades.map((g) => g.composition.find((c) => c.element === element));
        const shown = cells.map((c) => (c ? formatAmount(c) : ""));
        const differs = new Set(shown).size > 1;
        const highest = Math.max(...cells.map((c) => c?.pct ?? -1));
        return { element, cells, shown, differs, highest };
      });
  }, [grades, index]);

  if (error) {
    return <p className="rounded-md border border-danger-500/30 bg-danger-50 px-5 py-4 text-[0.9375rem] text-danger-700">{error}</p>;
  }

  if (ids.length === 0) {
    return (
      <div className="rounded-lg border border-steel-200 bg-white px-6 py-16 text-center">
        <h2 className="font-display text-xl font-semibold text-navy-900">Nothing selected yet</h2>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-steel-600">
          Add up to four grades from any category or from the alloy finder, and their compositions will line up here
          for comparison.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/materials/finder">Open the alloy finder</Button>
          <Button href="/materials" variant="secondary">
            Browse categories
          </Button>
        </div>
      </div>
    );
  }

  if (!index) {
    return <p className="text-[0.9375rem] text-steel-600">Loading composition data&hellip;</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9375rem] text-steel-700">
          Comparing <span className="font-semibold text-navy-900">{grades.length}</span> of 4 grades
          {rows.length ? (
            <>
              {" "}across <span className="font-semibold text-navy-900">{rows.length}</span> elements
            </>
          ) : null}
        </p>
        <div className="flex items-center gap-2">
          <ButtonEl type="button" variant="ghost" size="sm" onClick={clear}>
            Clear all
          </ButtonEl>
          <ButtonEl
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => downloadCsv("ims-comparison.csv", gradesToCsv(grades, index.elements.map((e) => e.symbol)))}
          >
            Export CSV
          </ButtonEl>
          <ButtonEl type="button" variant="secondary" size="sm" onClick={() => window.print()}>
            Print / PDF
          </ButtonEl>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-md border border-steel-200 bg-white">
        <div className="scroll-x">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Nominal composition of the selected grades, percentage by weight. Rows where the grades differ are
              marked.
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-20 min-w-[7rem] border-b border-r border-steel-200 bg-steel-100 px-4 py-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-steel-600"
                >
                  Element
                </th>
                {grades.map((g) => (
                  <th
                    key={g.id}
                    scope="col"
                    className="min-w-[11rem] border-b border-steel-200 bg-steel-100 px-4 py-3 align-top"
                  >
                    <span className="block font-display text-[0.9375rem] font-semibold leading-tight text-navy-900">
                      <Link href={g.href} className="transition-colors hover:text-brand-700">
                        {g.name}
                      </Link>
                    </span>
                    <span className="mt-1 block text-[0.75rem] font-normal text-steel-500">{g.categoryName}</span>
                    <span className="mt-2 flex items-center gap-1.5 print:hidden">
                      <button
                        type="button"
                        onClick={() => saved.toggle(g.id)}
                        aria-pressed={saved.has(g.id)}
                        className={cn(
                          "rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-medium transition-colors",
                          saved.has(g.id)
                            ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                            : "text-steel-600 hover:bg-white hover:text-brand-700",
                        )}
                      >
                        {saved.has(g.id) ? "Saved" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(g.id)}
                        className="rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-medium text-steel-600 transition-colors hover:bg-white hover:text-danger-600"
                      >
                        Remove
                      </button>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.element} className={cn(!row.differs && "bg-steel-50")}>
                  <th
                    scope="row"
                    /* The sticky column paints over the row, so it has to carry
                       the shading itself rather than inherit it. */
                    className={cn(
                      "sticky left-0 z-10 border-b border-r border-steel-200 px-4 py-2.5",
                      row.differs ? "bg-white" : "bg-steel-50",
                    )}
                  >
                    <span className="font-mono text-[0.8125rem] font-medium text-navy-900">{row.element}</span>
                    <span className="ml-2 text-[0.75rem] text-steel-500">
                      {index.elementNames[row.element] ?? ""}
                    </span>
                  </th>
                  {row.cells.map((cell, i) => (
                    <td
                      key={grades[i].id}
                      className={cn(
                        "border-b border-steel-100 px-4 py-2.5 font-mono text-[0.875rem] tabular-nums",
                        cell ? "text-steel-800" : "text-steel-400",
                        /* The leading figure for an element is worth spotting
                           when the whole point is choosing between them. */
                        row.differs && cell && cell.pct === row.highest && "font-semibold text-navy-900",
                      )}
                    >
                      {cell ? formatAmount(cell) : <span aria-label="not specified">&ndash;</span>}
                    </td>
                  ))}
                </tr>
              ))}

              {grades.some((g) => g.compounds?.length) ? (
                <tr>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-t border-r border-steel-200 bg-white px-4 py-2.5 font-mono text-[0.8125rem] font-medium text-navy-900"
                  >
                    Compounds
                  </th>
                  {grades.map((g) => (
                    <td key={g.id} className="border-t border-steel-100 px-4 py-2.5 text-[0.8125rem] text-steel-700">
                      {g.compounds?.join(", ") || <span aria-label="none">&ndash;</span>}
                    </td>
                  ))}
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-steel-500">
        Percentage by weight. &ldquo;max&rdquo; is an upper limit rather than a nominal figure, and &ldquo;Bal.&rdquo;
        is the balance of the alloy. A dash means the source table did not specify that element. Rows shaded grey are
        identical across every grade shown. Confirm the specification against your own requirement before ordering.
      </p>

      <div className="mt-8 rounded-lg border border-brand-200 bg-brand-50 p-6 print:hidden">
        <h2 className="font-display text-lg font-semibold text-navy-900">Ready to price these?</h2>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-steel-700">
          Send the selection straight through as a quotation request — the grades below travel with it, so nobody has
          to retype a composition.
        </p>
        <div className="mt-5">
          <Button href={`/rfq?grades=${encodeURIComponent(ids.join(","))}`}>Request a quotation</Button>
        </div>
      </div>
    </div>
  );
}
