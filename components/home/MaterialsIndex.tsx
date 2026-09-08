"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AlloyCategoryTeaser } from "@/types/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Material index with a linked preview.
 *
 * Pointer users get an image that tracks the row under the cursor; the preview
 * is decorative and the list itself is a plain set of links, so keyboard and
 * touch users lose nothing. All 15 images are rendered and cross-faded rather
 * than swapped by src, which avoids a flash of empty frame on hover.
 */
export function MaterialsIndex({
  categories,
  totalGrades,
}: {
  categories: AlloyCategoryTeaser[];
  totalGrades: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Section tone="white">
      <SectionHeader
        eyebrow="Metals & alloys"
        title="A working index of the alloys we handle."
        description={
          <>
            {totalGrades} grades across {categories.length} categories, each with its published
            nominal composition. Search by grade, element or application.
          </>
        }
        align="split"
        action={
          <Button href="/materials" variant="secondary">
            Explore all materials
          </Button>
        }
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <ul className="border-t border-steel-200">
            {categories.map((category, i) => (
              <li key={category.slug}>
                <Link
                  href={"/materials/" + category.slug}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  className="group flex items-baseline gap-4 border-b border-steel-200 py-4 transition-colors hover:bg-steel-50"
                >
                  <span className="w-7 shrink-0 font-mono text-[0.6875rem] text-steel-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-lg font-semibold tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
                    {category.name}
                  </span>
                  <span className="hidden max-w-[16rem] flex-1 truncate text-[0.8125rem] text-steel-500 xl:block">
                    {category.applications.join(", ")}
                  </span>
                  <span className="shrink-0 font-mono text-[0.75rem] text-steel-500 tabular-nums">
                    {category.gradeCount}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 text-steel-300 transition-all duration-200 ease-swift group-hover:translate-x-1 group-hover:text-brand-700"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div aria-hidden className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-steel-100">
              {categories.map((category, i) => (
                <Image
                  key={category.slug}
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 34vw, 0px"
                  className={cn(
                    "object-cover transition-opacity duration-500 ease-swift",
                    i === activeIndex ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-brand-300">
                  {categories[activeIndex].gradeCount} grades
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">
                  {categories[activeIndex].name}
                </p>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-steel-300">
                  {categories[activeIndex].summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
