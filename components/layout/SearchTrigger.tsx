"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useP } from "@/lib/i18n/phrases/client";

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
  const p = useP();
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
      {/* Icon only, matching the mobile menu button, so the header stays calm.
          The keyboard shortcut moves to the tooltip and is repeated in the
          overlay footer, so it is still discoverable without costing width. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={p("Search materials and pages")}
        aria-expanded={open}
        title="Search (Ctrl+K)"
        className="inline-flex h-10 w-10 items-center justify-center rounded text-steel-600 transition-colors hover:bg-steel-100 hover:text-brand-700"
      >
        <svg viewBox="0 0 18 18" aria-hidden className="h-[1.125rem] w-[1.125rem]">
          <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open ? <SearchOverlay onClose={() => setOpen(false)} /> : null}
    </>
  );
}
