"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchSite, kindLabels, type SearchDoc } from "@/lib/search";
import { cn } from "@/lib/utils";

/**
 * Search overlay.
 *
 * Loaded on demand by SearchTrigger, which keeps the search index — and the
 * alloy dataset it is built from — out of the bundle every page pays for.
 * Cmd/Ctrl-K opens it, arrow keys move the active row and Enter follows it.
 */
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => searchSite(query, 24), [query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    listRef.current?.querySelectorAll("li")[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = useCallback(
    (doc: SearchDoc) => {
      onClose();
      router.push(doc.href);
    },
    [onClose, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-navy-950/55 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
        onKeyDown={onKeyDown}
        className="relative mt-[8vh] flex w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-lift"
      >
        {/* The field itself is borderless and transparent, so focus is shown on
            this row's underline rather than as a ring floating around the input. */}
        <div className="flex items-center gap-3 border-b border-steel-200 px-5 transition-colors has-[input:focus-visible]:border-brand-700">
          <svg viewBox="0 0 18 18" aria-hidden className="h-4 w-4 shrink-0 text-steel-500">
            <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search alloys, grades, streams and pages"
            className="h-14 w-full border-0 bg-transparent text-[1.0625rem] text-navy-900 outline-none placeholder:text-steel-500 focus-visible:border-0 focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xs border border-steel-300 px-2 py-1 font-mono text-[0.6875rem] text-steel-500 hover:border-steel-400"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[min(28rem,60vh)] overflow-y-auto overscroll-contain">
          {query.trim().length < 2 ? (
            <div className="px-5 py-8">
              <p className="text-sm text-steel-500">
                Search 295 alloy grades, 15 material categories, recovery streams and every page.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Inconel 718", "Hastelloy", "Tungsten", "EAF Dust", "Aerospace"].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="rounded-sm border border-steel-200 px-2.5 py-1 text-[0.8125rem] text-steel-600 transition-colors hover:border-brand-700 hover:text-brand-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-steel-600">
                No matches for <span className="font-medium text-navy-900">{query}</span>.
              </p>
              <Link
                href="/contact"
                onClick={onClose}
                className="mt-3 inline-block text-sm font-medium text-brand-700 hover:text-brand-900"
              >
                Ask our team about this material &rarr;
              </Link>
            </div>
          ) : (
            <ul id="search-results" ref={listRef} role="listbox" className="py-2">
              {results.map((doc, i) => (
                <li key={doc.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(doc)}
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors",
                      i === active ? "bg-brand-50" : "hover:bg-steel-50",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] font-medium text-navy-900">{doc.title}</span>
                      <span className="block truncate text-[0.8125rem] text-steel-500">{doc.context}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-steel-500">
                      {kindLabels[doc.kind]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-steel-200 bg-steel-50 px-5 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-steel-500 sm:flex">
          <span>&uarr;&darr; Navigate</span>
          <span>&crarr; Open</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}
