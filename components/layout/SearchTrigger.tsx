"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Search entry point.
 *
 * The overlay carries the full search index, which is built from the alloy
 * dataset. Loading it lazily keeps roughly 30 kB of composition data out of the
 * bundle that every page would otherwise pay for, at the cost of one chunk
 * fetch the first time search is opened.
 */
const SearchOverlay = dynamic(() => import("./SearchOverlay").then((m) => m.SearchOverlay), {
  ssr: false,
});

export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search materials and pages"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded border border-steel-300 px-3 text-steel-500 transition-colors hover:border-brand-700 hover:text-brand-700"
      >
        <svg viewBox="0 0 18 18" aria-hidden className="h-4 w-4">
          <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="hidden text-[0.875rem] xl:inline">Search</span>
        <kbd className="hidden rounded-xs border border-steel-300 px-1.5 font-mono text-[0.6875rem] text-steel-500 xl:inline">
          &#8984;K
        </kbd>
      </button>
      {open ? <SearchOverlay onClose={() => setOpen(false)} /> : null}
    </>
  );
}
