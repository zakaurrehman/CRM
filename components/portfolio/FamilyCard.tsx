import Link from "next/link";
import type { PortfolioFamily } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * One material, as a tile on the navy board.
 *
 * Built to match the market board IMS pointed to (13 September 2026): navy
 * cells, hairline rules, one large white figure and a spaced mono label. Here
 * the figure is the symbol — Ni, Ti, HSS — and the label is the name. The
 * symbol sits on top, where the reference has its label, for two reasons: it
 * is the order IMS asked for ("the letters, then the name"), and a long name
 * that wraps to two lines would otherwise push its row's symbols out of line.
 *
 * Nothing else on the tile. The one-line description and the "Details &
 * quotation" text moved off with the change; the whole tile is the link, and
 * the detail is on the material's page one click in.
 */
export function FamilyCard({ family, className }: { family: PortfolioFamily; className?: string }) {
  return (
    <Link
      href={"/materials/" + family.slug}
      className={cn(
        /* The focus ring is inset: the board clips its outer edge, and a ring
           drawn outside the tile would be cut off on the edge tiles. */
        "group relative flex h-full flex-col px-4 py-5 transition-colors duration-300 hover:bg-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-300 sm:px-6 sm:py-7",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          aria-hidden
          className="font-display text-[1.75rem] font-semibold leading-none tracking-tight text-white sm:text-[2.25rem]"
        >
          {family.symbol}
        </span>
        {family.threshold ? (
          <span className="font-mono text-[0.6875rem] tabular-nums text-steel-400">{family.threshold}</span>
        ) : null}
      </div>
      <h3 className="mt-4 font-mono text-[0.625rem] uppercase leading-snug tracking-[0.12em] text-brand-300 transition-colors duration-300 group-hover:text-white sm:text-[0.6875rem] sm:tracking-[0.14em]">
        {family.name}
      </h3>
    </Link>
  );
}

/**
 * The symbol in its square. Sized for two letters; a longer shorthand widens
 * the box rather than shrinking the type, so "HSS" and "Ti" sit on the same
 * baseline at the same size.
 */
export function SymbolBox({ symbol, size = "md", className }: { symbol: string; size?: "md" | "lg"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md bg-steel-100 font-display font-semibold tracking-tight text-navy-900 transition-colors duration-300 group-hover:bg-brand-50 group-hover:text-brand-700",
        size === "md" ? "h-11 min-w-11 px-2 text-[1.125rem]" : "h-14 min-w-14 px-2.5 text-[1.5rem]",
        className,
      )}
    >
      {symbol}
    </span>
  );
}
