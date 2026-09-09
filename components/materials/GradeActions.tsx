"use client";

import { useCompare, useSaved } from "@/lib/alloy-client";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Add-to-comparison and save controls for a single grade.
 *
 * Both are toggles rather than one-way adds, because the same control has to
 * work as the way back out. State lives in the shared stores, so a grade added
 * from the finder shows as added on the category table and in the tray at once.
 *
 * The pressed state is carried by `aria-pressed`, not by colour alone.
 */
export function GradeActions({
  id,
  name,
  size = "md",
  className,
}: {
  id: string;
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const { t } = useI18n();
  const compare = useCompare();
  const saved = useSaved();

  const inCompare = compare.has(id);
  const isSaved = saved.has(id);
  const compareBlocked = !inCompare && compare.full;

  const box = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={() => compare.toggle(id)}
        disabled={compareBlocked}
        aria-pressed={inCompare}
        title={
          compareBlocked
            ? t("compare", "full", { max: compare.max })
            : inCompare
              ? t("compare", "removeFromComparison", { name })
              : t("compare", "addToComparison", { name })
        }
        className={cn(
          "inline-flex items-center justify-center rounded border transition-colors duration-200",
          box,
          inCompare
            ? "border-brand-700 bg-brand-700 text-white"
            : "border-steel-300 bg-white text-steel-600 hover:border-brand-700 hover:text-brand-700",
          compareBlocked && "cursor-not-allowed opacity-40 hover:border-steel-300 hover:text-steel-600",
        )}
      >
        <span className="sr-only">
          {inCompare ? t("compare", "removeFromComparison", { name }) : t("compare", "addToComparison", { name })}
        </span>
        {/* Two columns with a divider: a comparison, not a generic plus. */}
        <svg viewBox="0 0 16 16" aria-hidden className={icon}>
          <rect x="1.5" y="3" width="4.5" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="10" y="3" width="4.5" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => saved.toggle(id)}
        aria-pressed={isSaved}
        title={isSaved ? t("savedList", "removeName", { name }) : t("savedList", "saveName", { name })}
        className={cn(
          "inline-flex items-center justify-center rounded border transition-colors duration-200",
          box,
          isSaved
            ? "border-brand-700 bg-brand-50 text-brand-700"
            : "border-steel-300 bg-white text-steel-600 hover:border-brand-700 hover:text-brand-700",
        )}
      >
        <span className="sr-only">{isSaved ? t("savedList", "removeName", { name }) : t("savedList", "saveName", { name })}</span>
        <svg viewBox="0 0 16 16" aria-hidden className={icon}>
          <path
            d="M4 2h8a1 1 0 011 1v11l-5-3.2L3 14V3a1 1 0 011-1z"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
