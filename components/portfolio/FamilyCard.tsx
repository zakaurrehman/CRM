import Link from "next/link";
import type { PortfolioFamily } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { getP } from "@/lib/i18n/server";

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
export async function FamilyCard({ family, className }: { family: PortfolioFamily; className?: string }) {
  const p = await getP();

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
          className="font-display text-[1.75rem] font-medium leading-none tracking-tight text-white sm:text-[2.25rem]"
        >
          {family.symbol}
        </span>
        {family.threshold ? (
          <span className="font-mono text-[0.6875rem] tabular-nums text-steel-400">{family.threshold}</span>
        ) : null}
      </div>
      <h3 className="mt-4 font-mono text-[0.625rem] uppercase leading-snug tracking-[0.12em] text-brand-300 transition-colors duration-300 group-hover:text-white sm:text-[0.6875rem] sm:tracking-[0.14em]">
        {p(family.name)}
      </h3>
    </Link>
  );
}

/**
 * An element symbol or trade shorthand, set as type — Mo, FeNiCr, 18Ni.
 *
 * It used to sit in a tinted square; the squares came off on 13 September
 * 2026, when IMS asked for "less of these cubes".
 *
 * Colour and width are props, not classes a caller layers on top. `cn` joins
 * classes without resolving conflicts, so a caller's `text-*` or `min-w-*`
 * ties with the default here and loses on stylesheet order — which is how the
 * first version drew a navy mark on the navy page header.
 */
export function ElementMark({
  symbol,
  size = "md",
  tone = "ink",
  aligned = true,
  className,
}: {
  symbol: string;
  size?: "md" | "lg";
  /** ink: navy, blue on hover, for lists. accent: brand blue on a light ground. onDark: light blue on navy. */
  tone?: "ink" | "accent" | "onDark";
  /** Reserve a fixed width so a column of marks keeps its names aligned. Off for a lone mark beside a title. */
  aligned?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0 font-display font-medium tracking-tight transition-colors duration-300",
        size === "md" ? "text-[1.125rem]" : "text-[1.5rem]",
        aligned && (size === "md" ? "min-w-[3rem]" : "min-w-[5.5rem]"),
        tone === "ink" && "text-navy-900 group-hover:text-brand-700",
        tone === "accent" && "text-brand-700",
        tone === "onDark" && "text-brand-300",
        className,
      )}
    >
      {symbol}
    </span>
  );
}
