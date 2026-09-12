"use client";

import { useMemo, useState } from "react";
import { compositionFootnote } from "@/data/alloy-index";
import type { AlloyCategory } from "@/types/content";
import { cn, normalise } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { gradeId as makeGradeId } from "@/lib/alloy-ids";
import { GradeActions } from "./GradeActions";
import { ButtonEl } from "@/components/ui/Button";
import { useP } from "@/lib/i18n/phrases/client";

type View = "table" | "cards";

/**
 * Chemical composition table.
 *
 * Layout notes:
 * - The grade column is sticky on every breakpoint, so a reader scrolled to the
 *   far right still knows which alloy the numbers belong to.
 * - The header row is sticky under the site header on tall tables.
 * - Values are unmodified source data. Blank cells mean the source table left
 *   the element unspecified and are exposed to assistive tech as such.
 *
 * On a phone the same data is also offered as cards. A sideways-scrolling
 * eleven-column table is honest but miserable to read on a 390px screen, and
 * reflowing it destroys the ability to compare grades — so both exist and the
 * reader picks. The table stays the default because it is the reference view.
 */
export function CompositionTable({
  category,
  heading,
  id = "composition",
}: {
  category: AlloyCategory;
  /** Overrides the "Composition" heading — a family page with two tables names each by its source. */
  heading?: string;
  /** Anchor for the heading and a suffix for the filter control, so two tables on one page stay distinct. */
  id?: string;
}) {
  const p = useP();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("table");

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
          <h2 className="text-display-sm" id={id}>
            {heading ?? t("table", "heading")}
          </h2>
          <p className="mt-2 text-[0.9375rem] text-steel-600">
            {p("{n} grades · percentage by weight", { n: category.grades.length })}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          {category.grades.length > 8 ? (
            <div className="sm:w-72">
              <label htmlFor={id + "-filter"} className="sr-only">
                {t("table", "filterLabel", { category: category.name })}
              </label>
              <div className="relative">
                <svg
                  viewBox="0 0 18 18"
                  aria-hidden
                  className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500"
                >
                  <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                  id={id + "-filter"}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("table", "filterGrades")}
                  className="h-11 w-full rounded border border-steel-300 bg-white ps-9 pe-3 text-[0.9375rem] text-navy-900 transition-colors placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700"
                />
              </div>
            </div>
          ) : null}

          {/* Only worth offering where the table is actually cramped. */}
          <div role="group" aria-label={t("table", "view")} className="flex gap-1 sm:hidden">
            {(["table", "cards"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={cn(
                  "h-9 rounded border px-3 text-[0.8125rem] font-medium capitalize transition-colors",
                  view === v
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-steel-300 bg-white text-steel-700",
                )}
              >
                {v === "table" ? "Table" : "Cards"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {filtering ? t("table", "shownCount", { shown: rows.length, total: category.grades.length }) : ""}
      </p>

      {/* ---------- card view: phones only, and only when chosen ---------- */}
      {view === "cards" ? (
        <ul className="mt-6 space-y-3 sm:hidden">
          {rows.map((grade) => {
            const id = makeGradeId(category.slug, grade.name);
            const filled = grade.values
              .map((value, i) => ({ element: category.elements[i], value }))
              .filter((v) => v.value);
            return (
              <li
                key={grade.name}
                id={"grade-" + normalise(grade.name).replace(/ /g, "-")}
                className="rounded-md border border-steel-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[1rem] font-semibold leading-tight text-navy-900">{grade.name}</h3>
                  <GradeActions id={id} name={grade.name} size="sm" className="shrink-0" />
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2">
                  {filled.map((v) => (
                    <div key={v.element}>
                      <dt className="font-mono text-[0.625rem] tracking-[0.1em] text-steel-500">
                        {v.element}
                      </dt>
                      <dd className="font-mono text-[0.8125rem] tabular-nums text-navy-900">{v.value}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ul>
      ) : null}

      {/*
        ---------- table view ----------

        Two sticky strategies, because CSS forces the choice. Horizontal
        scrolling needs `overflow-x: auto`, and the spec makes the other axis
        compute to `auto` with it — so the box becomes the scrollport and a
        sticky header can only pin to the box, not the page. Scroll the page
        past the box and the headers leave with it, which left 17 rows of
        numbers on screen with no column labels.

        From xl up the table (~1080px) fits the container, so no scroll
        container is created at all and the header pins to the viewport under
        the site header — headers stay put however far down the page you read.

        Below xl horizontal scrolling is unavoidable, so the box keeps its own
        scrollport and the header pins inside it; the card view covers phones.
      */}
      <div
        className={cn(
          "mt-6 rounded-md border border-steel-200 overflow-hidden xl:overflow-visible",
          view === "cards" && "hidden sm:block",
        )}
      >
        <div className="scroll-x max-h-[min(70vh,44rem)] overflow-y-auto xl:max-h-none xl:overflow-visible">
          <table className="w-full min-w-[46rem] border-collapse text-start">
            <caption className="sr-only">
              {p("Nominal chemical composition of {name} grades handled by IMS, in percentage by weight.", { name: category.name })}
              {" "}
              {p(compositionFootnote)}
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky start-0 top-0 z-30 min-w-[15rem] border-b border-e border-steel-200 bg-steel-100 px-4 py-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-steel-600 xl:top-[var(--header-h)]"
                >
             {p("Grade")}
                </th>
                {category.elements.map((el) => (
                  <th
                    key={el}
                    scope="col"
                    className={cn(
                      /* No `uppercase` here: element symbols are case-significant — Co is cobalt, CO is carbon monoxide. */
                      "sticky top-0 z-20 border-b border-steel-200 bg-steel-100 px-3 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.1em] text-steel-600 xl:top-[var(--header-h)]",
                      el === "Others" ? "min-w-[10rem] text-start" : "min-w-[4.25rem] text-end",
                    )}
                  >
                    {el === "Others" ? p("Others") : el}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((grade) => (
                <tr key={grade.name} id={"grade-" + normalise(grade.name).replace(/ /g, "-")} className="group">
                  <th
                    scope="row"
                    className="sticky start-0 z-10 border-b border-e border-steel-200 bg-white px-4 py-2 text-[0.875rem] font-medium text-navy-900 transition-colors group-hover:bg-brand-50"
                  >
                    {/* In the sticky column rather than a trailing one, so the
                        controls stay on screen while the table is scrolled
                        sideways — and so the table gains no twelfth column. */}
                    <span className="flex items-center justify-between gap-3">
                      <span className="min-w-0">{grade.name}</span>
                      <GradeActions
                        id={makeGradeId(category.slug, grade.name)}
                        name={grade.name}
                        size="sm"
                        className="shrink-0 print:hidden"
                      />
                    </span>
                  </th>
                  {grade.values.map((value, i) => (
                    <td
                      key={category.elements[i]}
                      className={cn(
                        "border-b border-steel-100 px-3 py-2.5 font-mono text-[0.8125rem] tabular-nums transition-colors group-hover:bg-brand-50/50",
                        category.elements[i] === "Others" ? "text-start text-steel-600" : "text-end",
                        value ? "text-steel-800" : "text-steel-500",
                      )}
                    >
                      {value || <span aria-label={t("table", "notSpecified")}>&ndash;</span>}
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
              {t("table", "clearFilter")}
            </button>
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 print:hidden">
        <ButtonEl type="button" variant="secondary" size="sm" onClick={() => window.print()}>
          {t("common", "printPdf")}
        </ButtonEl>
        <p className="text-[0.8125rem] text-steel-500">
          {p("Select grades to compare them side by side, or save them to a shortlist.")}
        </p>
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-steel-500">
        {p(compositionFootnote)}{" "}
        {p("Values are reproduced from IMS technical data and are provided for identification purposes; confirm the specification against your own requirement before ordering.")}
      </p>
      <p className="mt-2 text-[0.8125rem] text-steel-500 sm:hidden">
        {p("Scroll the table sideways to see all elements, or switch to cards above.")}
      </p>
    </div>
  );
}

