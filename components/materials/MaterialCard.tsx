import Image from "next/image";
import Link from "next/link";
import type { AlloyCategory } from "@/types/content";
import { cn } from "@/lib/utils";
import { categoryProfiles } from "@/lib/alloy-profile";
import { SpecimenArt } from "./SpecimenArt";
import { getP } from "@/lib/i18n/server";

/** Material category card used on the homepage and in the materials directory. */
export async function MaterialCard({
  category,
  priority = false,
  className,
}: {
  category: AlloyCategory;
  priority?: boolean;
  className?: string;
}) {
  const p = await getP();
  return (
    <Link
      href={"/materials/" + category.slug}
      className={cn(
        "group relative flex flex-col overflow-hidden border border-steel-200 bg-white transition-all duration-300 ease-swift hover:border-steel-300 hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-steel-100">
        {category.cardArt === "specimen" ? (
          <SpecimenArt
            profile={categoryProfiles[category.slug] ?? []}
            className="absolute inset-0 transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
          />
        ) : (
          <>
            <Image
              src={category.image}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1280px) 24rem, (min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              /* Matches MaterialsBrowser: deep enough at the foot to carry the
                 count over a bright photograph as well as a dark one. */
              className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/10 to-transparent"
            />
          </>
        )}
        <span className="absolute bottom-3 start-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-white tabular-nums">
          {p("{n} grades", { n: category.grades.length })}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
          {category.name}
        </h3>
        <p className="content-en mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-steel-600">{category.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {category.properties.slice(0, 3).map((p) => (
            <li
              key={p}
              className="rounded-sm bg-steel-100 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-steel-600"
            >
              {p}
            </li>
          ))}
        </ul>

        <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700">
          {p("View composition")}
          <span aria-hidden className="transition-transform duration-200 ease-swift group-hover:translate-x-1">
            <span className="dir-arrow">&rarr;</span>
          </span>
        </span>
      </div>
    </Link>
  );
}
