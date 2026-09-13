import Link from "next/link";
import type { PortfolioFamily } from "@/data/portfolio";
import { getP } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

/**
 * One material in the portfolio grid.
 *
 * Symbol first, then the name, as IMS asked: the symbol sits in a square the
 * way an element sits in a periodic table. Where the material is an alloy
 * family rather than an element the square holds the trade shorthand instead
 * (HSS, 18Ni).
 *
 * No photograph. The cards used to open with one, rotating, and it came off on
 * 13 September 2026: scrap of one metal looks much like scrap of another, so
 * the photo did not help anyone tell the cards apart — the symbol does that —
 * and with half the materials still unphotographed the grid read as
 * unfinished. Photographs live on each material's own page, where there is
 * room to show what a lot actually looks like.
 *
 * Deliberately little else: the threshold where the intro states one, one line
 * on what is accepted, and a way in. The whole card is the link.
 */
export async function FamilyCard({ family, className }: { family: PortfolioFamily; className?: string }) {
  const p = await getP();

  return (
    <Link
      href={"/materials/" + family.slug}
      className={cn(
        "group relative flex h-full flex-col bg-white p-6 transition-[background-color,box-shadow] duration-300 hover:z-10 hover:shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <SymbolBox symbol={family.symbol} size="lg" />
        {family.threshold ? (
          <span className="rounded-full bg-steel-100 px-2.5 py-1 text-[0.75rem] font-medium text-navy-900">
            {family.threshold}
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 font-display text-[1.0625rem] font-semibold leading-snug tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
        {family.name}
      </h3>
      <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-steel-600">{p(family.accepts)}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700">
        {p("Details & quotation")}
        <span aria-hidden className="transition-transform duration-200 ease-swift group-hover:translate-x-1">
          <span className="dir-arrow">&rarr;</span>
        </span>
      </span>
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
