import { LiveMetalPrices } from "@/components/market/LiveMetalPrices";
import { isMetalsConfigured } from "@/lib/market/metals";
import { getP } from "@/lib/i18n/server";
import Image from "next/image";
import Link from "next/link";
import type { AlloyCategoryTeaser } from "@/types/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { categoryProfiles } from "@/lib/alloy-profile";
import { SpecimenArt } from "@/components/materials/SpecimenArt";

/**
 * The full material range as a photo grid.
 *
 * Every category is visible at once, which is what a buyer scanning for their
 * alloy family expects. Five across on desktop keeps all fifteen to three rows,
 * so the section stays dense rather than dominating the page.
 *
 * A heavy navy wash sits over each photograph. It ties the grid together, keeps
 * the category name legible over any image, and stops the backdrops competing
 * with one another — these are industrial scenes, not specimen photography, and
 * should read as texture behind the label.
 *
 * Now a server component: the previous version needed client-side hover state
 * to show a preview, which meant nothing at all on touch.
 */
export async function MaterialsIndex({
  categories,
  totalGrades,
}: {
  categories: AlloyCategoryTeaser[];
  totalGrades: number;
}) {
  const p = await getP();

  return (
    <Section tone="white">
      <SectionHeader
        eyebrow={p("Metals & alloys")}
        title={p("The full range, with the data behind it.")}
        description={
          <>
            {p("{grades} grades across {cats} categories, each published with its nominal composition. Open any category for the full table.", { grades: totalGrades, cats: categories.length })}
          </>
        }
        align="split"
        action={
          <Button href="/materials" variant="secondary">{p("Explore all materials")}</Button>
        }
      />

      <ul className="mt-14 grid grid-rule grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, i) => (
          <Reveal as="li" key={category.slug} delay={(i % 5) * 60} className="bg-navy-950">
            <Link
              href={"/materials/" + category.slug}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-4"
            >
              {category.cardArt === "specimen" ? (
                <SpecimenArt
                  compact
                  profile={categoryProfiles[category.slug] ?? []}
                  className="absolute inset-0 transition-transform duration-700 ease-swift group-hover:scale-[1.07]"
                />
              ) : (
                <>
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.07]"
                  />
                  <div
                    aria-hidden
                    /* Dark enough at the foot to carry the label, light enough
                       above that the photograph still reads. */
                    className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/10 transition-all duration-500 group-hover:via-navy-950/40 group-hover:to-transparent"
                  />
                </>
              )}
              <div className="relative">
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-brand-300 tabular-nums">
                  {p("{n} grades", { n: category.gradeCount })}
                </p>
                <h3 className="mt-1.5 font-display text-[0.9375rem] font-semibold leading-tight text-white">
                  {category.name}
                </h3>
              </div>
              <span
                aria-hidden
                className="absolute end-4 top-4 text-white/0 transition-all duration-300 ease-swift group-hover:translate-x-0.5 group-hover:text-white/80"
              >
                <span className="dir-arrow">&rarr;</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>

      {/* Market prices sit with the materials they price rather than in a band
          of their own.

          Whether a feed exists is known here, on the server, so an unconfigured
          site renders no widget at all. Leaving that to the client meant a
          loading skeleton appeared and then vanished once the fetch came back
          empty — a flash and a layout shift for something that was never going
          to show. */}
      {isMetalsConfigured() ? <LiveMetalPrices className="mt-12 max-w-2xl" /> : null}
    </Section>
  );
}
