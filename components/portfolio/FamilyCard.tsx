import Link from "next/link";
import type { PortfolioFamily } from "@/data/portfolio";
import { groupOf } from "@/lib/portfolio";
import { getP } from "@/lib/i18n/server";
import { RotatingImage } from "@/components/ui/RotatingImage";
import { cn } from "@/lib/utils";

/**
 * One family in the portfolio grid.
 *
 * Deliberately little on it: the group, the name, the threshold where the
 * intro states one, one line on what is accepted, and a way in. Grade counts,
 * property tags and a paragraph of metallurgy were what made the old material
 * cards heavy — those live on the family page now, below the fold.
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
  const group = groupOf(family);

  return (
    <Link
      href={"/materials/" + family.slug}
      className={cn(
        "group flex h-full flex-col bg-white transition-colors duration-300 hover:bg-steel-50",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-steel-100">
        {family.images.length > 0 ? (
          <RotatingImage
            images={family.images}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
            offsetMs={(index % 4) * 1100}
            priority={priority}
            className="transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
          />
        ) : (
          /* No honest photograph of this family yet. A quiet, light slot
             rather than a picture of some other metal or a coloured tile —
             IMS is choosing the shots, and this is where they go. */
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-steel-50 to-steel-200">
            <div className="tech-grid-light absolute inset-0" />
          </div>
        )}
        {family.threshold ? (
          <span className="absolute end-3 top-3 rounded-sm border border-navy-950/15 bg-white/85 px-2 py-0.5 font-mono text-[0.6875rem] font-medium tracking-[0.06em] text-navy-900 backdrop-blur-sm">
            {family.threshold}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.13em] text-steel-500">{p(group.name)}</p>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
          {family.name}
        </h3>
        <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-steel-600">{p(family.accepts)}</p>
        {family.also ? (
          <p className="mt-2 font-mono text-[0.75rem] text-steel-500">{family.also.join(" · ")}</p>
        ) : null}
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
