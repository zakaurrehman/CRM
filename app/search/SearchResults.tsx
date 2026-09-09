"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { searchSite, kindLabels, type SearchKind } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useP } from "@/lib/i18n/phrases/client";

const groupOrder: SearchKind[] = ["page", "material", "industry", "grade", "stream", "tungsten", "article"];

export function SearchResults() {
  const p = useP();
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  const results = useMemo(() => searchSite(query, 200), [query]);

  const grouped = useMemo(() => {
    const map = new Map<SearchKind, typeof results>();
    for (const doc of results) {
      const list = map.get(doc.kind) ?? [];
      list.push(doc);
      map.set(doc.kind, list);
    }
    return groupOrder.filter((kind) => map.has(kind)).map((kind) => [kind, map.get(kind)!] as const);
  }, [results]);

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(query ? "/search?q=" + encodeURIComponent(query) : "/search");
        }}
      >
        <label htmlFor="site-search" className="sr-only">
          {p("Search the site")}
        </label>
        <div className="relative">
          <svg
            viewBox="0 0 18 18"
            aria-hidden
            className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-400"
          >
            <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            id="site-search"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={p("Search alloys, grades, streams and pages")}
            className="h-14 w-full rounded border border-steel-300 bg-white ps-12 pe-4 text-[1.0625rem] text-navy-900 transition-colors placeholder:text-steel-400 hover:border-steel-400 focus:border-brand-700"
          />
        </div>
      </form>

      <p aria-live="polite" className="mt-6 text-[0.9375rem] text-steel-500">
        {query.trim().length < 2
          ? "Type at least two characters to search."
          : `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`}
      </p>

      {grouped.length > 0 ? (
        <div className="mt-10 space-y-12">
          {grouped.map(([kind, docs]) => (
            <section key={kind}>
              <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                {kindLabels[kind]} <span className="text-steel-400">({docs.length})</span>
              </h2>
              <ul className={cn("mt-4", kind === "grade" ? "flex flex-wrap gap-2" : "border-t border-steel-200")}>
                {docs.map((doc) =>
                  kind === "grade" ? (
                    <li key={doc.id}>
                      <Link
                        href={doc.href}
                        className="inline-flex items-center gap-2 rounded-sm border border-steel-200 px-3 py-1.5 text-[0.875rem] transition-colors hover:border-brand-700"
                      >
                        <span className="font-medium text-navy-900">{doc.title}</span>
                        <span className="text-steel-500">{doc.context}</span>
                      </Link>
                    </li>
                  ) : (
                    <li key={doc.id}>
                      <Link
                        href={doc.href}
                        className="group flex items-center justify-between gap-4 border-b border-steel-200 py-4"
                      >
                        <span>
                          <span className="block text-[1.0625rem] font-medium text-navy-900 transition-colors group-hover:text-brand-700">
                            {doc.title}
                          </span>
                          <span className="mt-0.5 block text-[0.875rem] text-steel-500">{doc.context}</span>
                        </span>
                        <span
                          aria-hidden
                          className="shrink-0 text-steel-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-700"
                        >
                          <span className="dir-arrow">&rarr;</span>
                        </span>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </section>
          ))}
        </div>
      ) : query.trim().length >= 2 ? (
        <div className="mt-10 border border-steel-200 bg-steel-50 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-navy-900">{p("Nothing matched that search")}</p>
          <p className="mx-auto mt-2 max-w-md text-[0.9375rem] text-steel-600">
            {p("We handle a wider range of material than the site documents. Tell us what you are looking for and we will confirm whether we can source or recover it.")}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex h-11 items-center rounded bg-brand-700 px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-brand-800"
          >
            {p("Ask our team")}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
