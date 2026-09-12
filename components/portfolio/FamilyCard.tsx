import Link from "next/link";
import type { PortfolioFamily } from "@/data/portfolio";
import { getP } from "@/lib/i18n/server";
import { RotatingImage } from "@/components/ui/RotatingImage";
import { cn } from "@/lib/utils";

/**
 * One material in the portfolio grid.
 *
 * Symbol first, then the name — "Ti · Titanium" — as IMS asked: the symbol
 * sits in a small square, the way an element sits in a periodic table, and
 * the name follows it. Where the material is an alloy family rather than an
 * element the square holds the trade shorthand instead (HSS, 18Ni).
 *
 * Deliberately little else: one line on what is accepted, the threshold
 * where the intro states one, and a way in. Grade counts, property tags and
 * a paragraph of metallurgy were what made the old cards heavy — those live
 * on the material page now, below the fold.
 *
 * The whole card is the link. Its label promises the page it opens — details
 * and a quotation — rather than pretending to be a quotation button itself.
 */
export async function FamilyCard({
  family,
  index = 0,
  priority = false,
  className,
}: {
  family: PortfolioFamily;
  /** Position in the grid; staggers the photo rotation so cards do not flip together. */
  index?: number;
  priority?: boolean;
  className?: string;
}) {
  const p = await getP();

  return (
    <Link
      href={"/materials/" + family.slug}
      className={cn(
        "group relative flex h-full flex-col bg-white transition-[background-color,box-shadow] duration-300 hover:z-10 hover:bg-white hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-steel-100">
        {family.images.length > 0 ? (
          <RotatingImage
            images={family.images}
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
            offsetMs={(index % 4) * 1100}
            priority={priority}
            className="transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
          />
        ) : (
          /* No honest photograph of this material yet. A quiet, light slot
             rather than a picture of some other metal — IMS is choosing the
             shots, and this is where they go. */
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-steel-50 to-steel-200">
            <div className="tech-grid-light absolute inset-0" />
          </div>
        )}
        {family.threshold ? (
          <span className="absolute end-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.75rem] font-medium text-navy-900 backdrop-blur-sm">
            {family.threshold}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3.5">
          <SymbolBox symbol={family.symbol} />
          <h3 className="font-display text-[1.0625rem] font-semibold leading-snug tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
            {family.name}
          </h3>
        </div>
        <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-steel-600">{p(family.accepts)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700">
          {p("Details & quotation")}
          <span aria-hidden className="transition-transform duration-200 ease-swift group-hover:translate-x-1">
            <span className="dir-arrow">&rarr;</span>
          </span>
        </span>
      </div>
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
