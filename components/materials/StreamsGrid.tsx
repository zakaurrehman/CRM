"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { recoveryStreams, recoveryForms } from "@/data/recovery";
import { cn } from "@/lib/utils";

type Filter = (typeof recoveryForms)[number] | "all";

/**
 * Visual grid of the metal-bearing streams IMS treats.
 *
 * Grouped by physical form because that is what determines handling — a
 * filtercake and a dry powder arrive and are processed differently, even when
 * they carry the same metal.
 */
export function StreamsGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const streams = useMemo(
    () => (filter === "all" ? recoveryStreams : recoveryStreams.filter((s) => s.form === filter)),
    [filter],
  );

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", recoveryStreams.length]]);
    for (const form of recoveryForms) map.set(form, recoveryStreams.filter((s) => s.form === form).length);
    return map;
  }, []);

  return (
    <div>
      <div className="scroll-x -mx-5 px-5 sm:mx-0 sm:px-0">
        <div role="group" aria-label="Filter streams by physical form" className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
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
                {form === "all" ? "All streams" : form}
                <span className={cn("font-mono text-[0.6875rem] tabular-nums", selected ? "text-white/70" : "text-steel-500")}>
                  {counts.get(form)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-[0.875rem] text-steel-500">
        {streams.length} of {recoveryStreams.length} streams
      </p>

      <ul className="mt-4 grid grid-cols-2 grid-rule sm:grid-cols-3 lg:grid-cols-5">
        {streams.map((stream) => (
          <li key={stream.slug} id={"stream-" + stream.slug} className="group bg-white">
            <div className="flex h-full flex-col items-center p-5 transition-colors group-hover:bg-steel-50">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                <Image
                  src={stream.image}
                  alt={stream.name + " recovery stream"}
                  fill
                  sizes="112px"
                  className="object-contain mix-blend-multiply transition-transform duration-500 ease-swift group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-center font-display text-[0.9375rem] font-semibold leading-tight text-navy-900">
                {stream.name}
              </h3>
              <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-steel-500">
                {stream.form}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
