"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { recoveryForms } from "@/data/recovery";
import type { RecoveryStream } from "@/types/content";
import { cn } from "@/lib/utils";
import { useP } from "@/lib/i18n/phrases/client";

type Filter = (typeof recoveryForms)[number] | "all";

/**
 * Visual grid of the metal-bearing streams IMS treats.
 *
 * Grouped by physical form because that is what determines handling — a
 * filtercake and a dry powder arrive and are processed differently, even when
 * they carry the same metal.
 */
export function StreamsGrid({ allStreams }: { allStreams: RecoveryStream[] }) {
  const p = useP();
  const [filter, setFilter] = useState<Filter>("all");

  /* Passed in rather than imported so the page can hand over names already in
     the reader's language. The slugs, images and physical forms are unchanged —
     only the display name is localised. */
  const streams = useMemo(
    () => (filter === "all" ? allStreams : allStreams.filter((s) => s.form === filter)),
    [filter, allStreams],
  );

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", allStreams.length]]);
    for (const form of recoveryForms) map.set(form, allStreams.filter((s) => s.form === form).length);
    return map;
  }, [allStreams]);

  return (
    <div>
      <div className="scroll-x -mx-5 px-5 sm:mx-0 sm:px-0">
        <div role="group" aria-label={p("Filter streams by physical form")} className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
          {(["all", ...recoveryForms] as Filter[]).map((form) => {
            const selected = filter === form;
            return (
              <button
                key={form}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(form)}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded border px-3.5 text-[0.875rem] font-medium transition-colors",
                  selected
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-steel-300 bg-white text-steel-700 hover:border-brand-700 hover:text-brand-700",
                )}
              >
                {form === "all" ? p("All streams") : p(form)}
                <span className={cn("font-mono text-[0.6875rem] tabular-nums", selected ? "text-white/90" : "text-steel-500")}>
                  {counts.get(form)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-[0.875rem] text-steel-500">
        {p("{shown} of {total} streams", { shown: streams.length, total: allStreams.length })}
      </p>

      <ul className="mt-4 grid grid-cols-2 grid-rule sm:grid-cols-3 lg:grid-cols-5">
        {streams.map((stream) => (
          <li key={stream.slug} id={"stream-" + stream.slug} className="group bg-white">
            <div className="flex h-full flex-col items-center p-5 transition-colors group-hover:bg-steel-50">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-steel-100 sm:h-28 sm:w-28">
                <Image
                  src={stream.image}
                  alt={stream.name + " recovery stream"}
                  fill
                  sizes="112px"
                  className="scale-[0.82] object-contain mix-blend-multiply transition-transform duration-500 ease-swift group-hover:scale-[0.88]"
                />
              </div>
              <h3 className="mt-4 text-center font-display text-[0.9375rem] font-semibold leading-tight text-navy-900">
                {stream.name}
              </h3>
              <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-steel-500">
                {p(stream.form)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
