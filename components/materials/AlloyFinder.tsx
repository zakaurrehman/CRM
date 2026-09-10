"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAlloyIndex, formatAmount, type ClientGrade } from "@/lib/alloy-client";
import { parseQuery, matchGrades, exampleQueries, type ElementConstraint, type Comparator } from "@/lib/alloy-query";
import { alloyGroupLabels, alloyGroupOrder } from "@/lib/navigation";
import { downloadCsv, gradesToCsv } from "@/lib/export";
import type { AlloyGroup } from "@/types/content";
import { GradeActions } from "./GradeActions";
import { ButtonEl } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { categoryNameFor } from "@/lib/i18n/content";
import { useP } from "@/lib/i18n/phrases/client";

const OPERATORS: { op: Comparator; label: string }[] = [
  { op: "gte", label: "≥" },
  { op: "lte", label: "≤" },
  { op: "gt", label: ">" },
  { op: "lt", label: "<" },
];

const PAGE = 40;

/**
 * The alloy finder.
 *
 * Two ways in, over the same engine. A buyer who knows the language types
 * "cobalt free nickel alloy with chromium above 20" and gets exactly that; a
 * buyer who would rather click builds the same query from element rows. Both
 * render the interpretation as removable chips, so the filter in force is
 * always visible and never something the reader has to infer from the results.
 *
 * Results stream in from the static index — nothing here is server-rendered
 * per query, so the whole thing works at the speed of typing.
 */
export function AlloyFinder() {
  const p = useP();
  const { t, locale } = useI18n();
  const { index, error } = useAlloyIndex();
  const [text, setText] = useState("");
  const [rows, setRows] = useState<ElementConstraint[]>([]);
  const [groups, setGroups] = useState<AlloyGroup[]>([]);
  const [limit, setLimit] = useState(PAGE);

  const deferred = useDeferredValue(text);

  const parsed = useMemo(
    () => parseQuery(deferred, index?.thresholds),
    [deferred, index?.thresholds],
  );

  /* The typed query and the built rows are one query, not two. Merging here
     rather than filtering twice keeps the result count honest. */
  const effective = useMemo(
    () => ({
      ...parsed,
      constraints: [...parsed.constraints, ...rows.filter((r) => Number.isFinite(r.value))],
      groups: groups.length ? groups : parsed.groups,
    }),
    [parsed, rows, groups],
  );

  const results = useMemo(() => {
    if (!index) return [];
    return matchGrades(index.grades, effective, deferred);
  }, [index, effective, deferred]);

  useEffect(() => setLimit(PAGE), [deferred, rows, groups]);

  const active =
    effective.constraints.length + effective.absent.length + effective.present.length + effective.groups.length;
  const filtering = active > 0 || effective.terms.length > 0;

  const addRow = () =>
    setRows((r) => [...r, { element: index?.elements[0]?.symbol ?? "Ni", op: "gte", value: 20 }]);

  if (error) {
    return (
      <p className="rounded-md border border-danger-500/30 bg-danger-50 px-5 py-4 text-[0.9375rem] text-danger-700">
        {error}
      </p>
    );
  }

  return (
    <div>
      {/* ---------- query ---------- */}
      <div className="rounded-lg border border-steel-200 bg-white p-5 shadow-subtle sm:p-6">
        <label htmlFor="finder-q" className="block font-display text-[0.9375rem] font-semibold text-navy-900">
          {t("finder", "describe")}
        </label>
        <p className="mt-1 text-[0.875rem] text-steel-600">
          {p("Plain English or symbols — “cobalt free, chromium above 20” and “Cr >= 20 no Co” are read the same way.")}
        </p>

        <div className="relative mt-3">
          <svg
            viewBox="0 0 18 18"
            aria-hidden
            className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500"
          >
            <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            id="finder-q"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("finder", "placeholder")}
            autoComplete="off"
            className="h-12 w-full rounded border border-steel-300 bg-white ps-10 pe-4 text-[0.9375rem] text-navy-900 transition-colors placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700"
          />
        </div>

        {!text ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[0.8125rem] text-steel-500">Try:</span>
            {exampleQueries.slice(0, 4).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setText(q)}
                className="rounded-sm border border-steel-200 bg-steel-50 px-2.5 py-1 text-[0.8125rem] text-steel-700 transition-colors hover:border-brand-700 hover:text-brand-700"
              >
                {q}
              </button>
            ))}
          </div>
        ) : null}

        {/* What the parser understood. Shown always, so nothing is applied invisibly. */}
        {parsed.explain.length > 0 ? (
          <div className="mt-4 rounded border border-brand-200 bg-brand-50 px-4 py-3">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-800">
              {t("finder", "readingAs")}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {parsed.explain.map((e) => (
                <li
                  key={e}
                  className="rounded-sm bg-white px-2 py-1 font-mono text-[0.75rem] text-navy-900 ring-1 ring-brand-200"
                >
                  {e}
                </li>
              ))}
              {parsed.terms.map((t) => (
                <li key={"t" + t} className="rounded-sm bg-white px-2 py-1 text-[0.75rem] text-steel-700 ring-1 ring-steel-200">
                  name contains &ldquo;{t}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* ---------- element rows ---------- */}
        <div className="mt-5 border-t border-steel-200 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-[0.9375rem] font-semibold text-navy-900">{t("finder", "compositionFilters")}</p>
            <ButtonEl type="button" variant="secondary" size="sm" onClick={addRow} disabled={!index}>
              {t("finder", "addElement")}
            </ButtonEl>
          </div>

          {rows.length === 0 ? (
            <p className="mt-2 text-[0.875rem] text-steel-500">
              {p("No composition filter set. Add one to bound an element by percentage.")}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {rows.map((row, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`el-${i}`}>{t("finder", "element")}</label>
                  <select
                    id={`el-${i}`}
                    value={row.element}
                    onChange={(e) =>
                      setRows((r) => r.map((x, j) => (j === i ? { ...x, element: e.target.value } : x)))
                    }
                    className="h-10 rounded border border-steel-300 bg-white px-2.5 text-[0.875rem] text-navy-900 focus:border-brand-700"
                  >
                    {index?.elements.map((el) => (
                      <option key={el.symbol} value={el.symbol}>
                        {el.symbol} — {el.name}
                      </option>
                    ))}
                  </select>

                  <label className="sr-only" htmlFor={`op-${i}`}>{t("finder", "comparison")}</label>
                  <select
                    id={`op-${i}`}
                    value={row.op}
                    onChange={(e) =>
                      setRows((r) => r.map((x, j) => (j === i ? { ...x, op: e.target.value as Comparator } : x)))
                    }
                    className="h-10 w-16 rounded border border-steel-300 bg-white px-2.5 text-center text-[0.875rem] text-navy-900 focus:border-brand-700"
                  >
                    {OPERATORS.map((o) => (
                      <option key={o.op} value={o.op}>{o.label}</option>
                    ))}
                  </select>

                  <label className="sr-only" htmlFor={`v-${i}`}>{t("finder", "percentage")}</label>
                  <input
                    id={`v-${i}`}
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={row.value}
                    onChange={(e) =>
                      setRows((r) => r.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)))
                    }
                    className="h-10 w-24 rounded border border-steel-300 bg-white px-2.5 text-[0.875rem] tabular-nums text-navy-900 focus:border-brand-700"
                  />
                  <span className="text-[0.875rem] text-steel-500">%</span>

                  <button
                    type="button"
                    onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
                    className="ms-auto inline-flex h-10 items-center rounded px-3 text-[0.875rem] text-steel-600 transition-colors hover:bg-steel-100 hover:text-danger-600 sm:ms-0"
                  >
                {p("Remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ---------- groups ---------- */}
        <div className="mt-5 border-t border-steel-200 pt-5">
          <p className="font-display text-[0.9375rem] font-semibold text-navy-900">{t("finder", "materialGroup")}</p>
          <div className="scroll-x -mx-1 mt-3 px-1">
            <div role="group" aria-label={t("finder", "filterByGroup")} className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
              {alloyGroupOrder.map((g) => {
                const on = groups.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setGroups((s) => (on ? s.filter((x) => x !== g) : [...s, g]))}
                    className={cn(
                      "h-9 shrink-0 rounded border px-3.5 text-[0.875rem] font-medium transition-colors",
                      on
                        ? "border-brand-700 bg-brand-700 text-white"
                        : "border-steel-300 bg-white text-steel-700 hover:border-brand-700 hover:text-brand-700",
                    )}
                  >
                    {p(alloyGroupLabels[g])}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- results ---------- */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9375rem] text-steel-700" aria-live="polite">
          {!index ? (
            p("Loading the catalogue…")
          ) : (
            <>
              {filtering
                ? p("{n} grades match your filter", { n: results.length })
                : p("{n} grades in the catalogue", { n: results.length })}
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          {filtering ? (
            <ButtonEl
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setText("");
                setRows([]);
                setGroups([]);
              }}
            >
              {t("common", "reset")}
            </ButtonEl>
          ) : null}
          <ButtonEl
            type="button"
            variant="secondary"
            size="sm"
            disabled={!index || results.length === 0}
            onClick={() =>
              downloadCsv(
                "ims-alloy-search.csv",
                gradesToCsv(results.map((r) => r.grade), index!.elements.map((e) => e.symbol)),
              )
            }
          >
            {t("common", "exportCsv")}
          </ButtonEl>
        </div>
      </div>

      {index && results.length === 0 ? (
        <p className="mt-6 rounded-md border border-steel-200 bg-steel-50 px-5 py-10 text-center text-[0.9375rem] text-steel-600">
          {p("No grade in the catalogue meets every condition.")}
          <br className="hidden sm:block" /> Try relaxing one of the filters above, or{" "}
          <Link href="/contact" className="font-medium text-brand-700 hover:underline">
            {p("ask us directly")}
          </Link>{" "}
          — we handle material beyond what is published here.
        </p>
      ) : null}

      <ul className="mt-5 grid grid-rule sm:grid-cols-2 xl:grid-cols-3">
        {results.slice(0, limit).map(({ grade, reasons }) => (
          <li key={grade.id} className="bg-white">
            <GradeResult grade={grade} reasons={reasons} />
          </li>
        ))}
      </ul>

      {results.length > limit ? (
        <div className="mt-8 text-center">
          <ButtonEl type="button" variant="secondary" onClick={() => setLimit((l) => l + PAGE)}>
            {p("Show {n} more", { n: Math.min(PAGE, results.length - limit) })}
          </ButtonEl>
        </div>
      ) : null}
    </div>
  );
}

function GradeResult({ grade, reasons }: { grade: ClientGrade; reasons: string[] }) {
  const { locale } = useI18n();
  const p = useP();
  // The four largest constituents identify an alloy at a glance.
  const headline = grade.composition.slice(0, 4);

  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold leading-tight text-navy-900">
            <Link href={grade.href} className="transition-colors hover:text-brand-700">
              {grade.name}
            </Link>
          </h3>
          <p className="mt-1 text-[0.8125rem] text-steel-500">{categoryNameFor(grade.categorySlug, grade.categoryName, locale)}</p>
        </div>
        <GradeActions id={grade.id} name={grade.name} size="sm" className="shrink-0" />
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {headline.map((c) => (
          <div key={c.element} className="flex items-baseline gap-1.5">
            <dt className="font-mono text-[0.6875rem] tracking-[0.1em] text-steel-500">{c.element}</dt>
            <dd className="font-mono text-[0.8125rem] tabular-nums text-navy-900">{formatAmount(c)}</dd>
          </div>
        ))}
      </dl>

      {reasons.length > 0 ? (
        <p className="mt-3 text-[0.75rem] text-steel-500">{p("Matched on {reasons}", { reasons: reasons.join(", ") })}</p>
      ) : null}

      <Link
        href={grade.href}
        className="mt-auto pt-4 text-[0.8125rem] font-medium text-brand-700 transition-colors hover:text-brand-900"
      >
        {p("Full composition")} <span className="dir-arrow">&rarr;</span>
      </Link>
    </div>
  );
}
