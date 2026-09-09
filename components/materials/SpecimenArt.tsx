import type { ElementShare } from "@/lib/alloy-profile";
import { cn } from "@/lib/utils";

/**
 * Card artwork for the alloy families IMS has no photograph of.
 *
 * The alternative was a generic industrial photo standing in for a metal it is
 * not — a scrap yard on the titanium page, tungsten crucibles on zirconium.
 * That reads as carelessness to exactly the technical buyer this site is for.
 *
 * So instead of a wrong picture, the card shows the family's own chemistry:
 * the dominant element large, the rest as a proportional band. It is derived
 * from the published tables rather than decorative, which makes it more useful
 * than the photograph it replaces — a buyer can identify the family at a glance.
 *
 * Replace with real photography as IMS supplies it; see docs item 20 for the
 * shot list. Swapping a category back to a photo is a one-word data change.
 */
export function SpecimenArt({
  profile,
  className,
  compact = false,
}: {
  profile: ElementShare[];
  className?: string;
  /** Tighter treatment for the small homepage grid tiles. */
  compact?: boolean;
}) {
  if (profile.length === 0) return <div aria-hidden className={cn("absolute inset-0 bg-navy-900", className)} />;

  const [lead, ...rest] = profile;
  // Normalised purely to size the band; the printed figures stay as published.
  const total = profile.reduce((sum, e) => sum + e.median, 0);

  return (
    <div
      aria-hidden
      /* Positioned here rather than by the caller. This is always a background
         layer filling the card's aspect box, and when the caller passed
         `absolute` against a `relative` base the two utilities tied on
         specificity — stylesheet order won, the panel collapsed to its content
         height, and the card's light ground showed through behind the label. */
      className={cn(
        "absolute inset-0 isolate overflow-hidden bg-gradient-to-br from-navy-900 via-navy-950 to-brand-950",
        className,
      )}
    >
      <div className="tech-grid absolute inset-0 opacity-[0.5]" />

      {/* A soft brand glow behind the symbol, so the tile has depth rather than
          reading as a flat colour swatch. */}
      <div className="absolute -end-8 -top-10 h-40 w-40 rounded-full bg-brand-700/25 blur-3xl" />

      {/* Extra room at the foot: the card that hosts this paints its own
          "N grades" label over the bottom-left corner. */}
      <div
        className={cn(
          "relative flex h-full flex-col justify-between",
          compact ? "px-4 pb-9 pt-4" : "px-6 pb-11 pt-6",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "font-display font-bold leading-none tracking-tight text-white/90",
              compact ? "text-[2.25rem]" : "text-[3.25rem]",
            )}
          >
            {lead.element}
          </span>
          <span
            className={cn(
              "font-mono tabular-nums text-brand-300",
              compact ? "text-[0.625rem]" : "text-[0.75rem]",
            )}
          >
            {lead.median}%
          </span>
        </div>

        <div>
          {/* Proportional band across the characteristic elements. */}
          <div className="flex h-1 w-full overflow-hidden rounded-full bg-white/10">
            {profile.map((e, i) => (
              <span
                key={e.element}
                style={{ width: `${(e.median / total) * 100}%` }}
                className={cn(
                  "h-full",
                  i === 0 ? "bg-brand-400" : i === 1 ? "bg-brand-600" : "bg-white/25",
                )}
              />
            ))}
          </div>

          {rest.length > 0 ? (
            <p
              className={cn(
                "mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono tabular-nums text-white/55",
                compact ? "text-[0.625rem]" : "text-[0.6875rem]",
              )}
            >
              {rest.map((e) => (
                <span key={e.element}>
                  {e.element} {e.median}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
