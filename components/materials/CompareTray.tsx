"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAlloyIndex, useCompare } from "@/lib/alloy-client";
import { cn } from "@/lib/utils";

/**
 * Persistent comparison tray.
 *
 * Appears only once something is in it, and hides itself on the comparison page
 * where it would duplicate the table. Mounted in the root layout so a selection
 * made on a category page survives navigation to another one — the whole point
 * of comparing is that the grades come from different places.
 *
 * Sits above the WhatsApp button's corner and leaves room for it.
 */
export function CompareTray() {
  const { ids, remove, clear } = useCompare();
  const { index } = useAlloyIndex();
  const pathname = usePathname();

  if (ids.length === 0 || pathname === "/materials/compare") return null;

  const names = ids.map((id) => ({ id, name: index?.gradeById.get(id)?.name ?? id.split(":")[1] }));

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-navy-800 bg-navy-950/95 backdrop-blur-md",
        "motion-safe:animate-slide-up",
      )}
      role="region"
      aria-label="Material comparison"
    >
      <div className="mx-auto flex max-w-container flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <p className="hidden shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-300 sm:block">
            Comparing {ids.length}
          </p>
          <ul className="scroll-x flex min-w-0 flex-1 items-center gap-2 pb-1 sm:pb-0">
            {names.map((g) => (
              <li key={g.id} className="shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/5 py-1 pl-2.5 pr-1 text-[0.8125rem] text-white">
                  {g.name}
                  <button
                    type="button"
                    onClick={() => remove(g.id)}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-steel-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <span className="sr-only">Remove {g.name} from comparison</span>
                    <svg viewBox="0 0 12 12" aria-hidden className="h-2.5 w-2.5">
                      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-2 pr-0 sm:pr-16">
          <button
            type="button"
            onClick={clear}
            className="h-9 rounded px-3 text-[0.875rem] font-medium text-steel-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Clear
          </button>
          <Link
            href="/materials/compare"
            className="inline-flex h-9 items-center justify-center rounded bg-white px-4 text-[0.875rem] font-medium text-navy-900 transition-colors hover:bg-brand-50"
          >
            Compare {ids.length}
          </Link>
        </div>
      </div>
    </div>
  );
}
