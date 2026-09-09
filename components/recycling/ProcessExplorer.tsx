"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProcessStep } from "@/types/content";
import { cn } from "@/lib/utils";
import { useP } from "@/lib/i18n/phrases/client";

/**
 * The recovery workflow, walked one step at a time.
 *
 * Built on the tabs pattern rather than a set of buttons: arrow keys move
 * between steps, Home and End jump to the ends, and only the selected tab is in
 * the tab order — which is what a screen-reader user expects the moment the
 * markup says `role="tablist"`.
 *
 * Every panel is rendered and the inactive ones are hidden with the `hidden`
 * attribute, so the whole sequence is present for search engines and for anyone
 * without JavaScript, where the first panel simply stays open.
 */
export function ProcessExplorer({
  steps,
  images,
}: {
  steps: ProcessStep[];
  /** Positionally aligned with `steps`; falls back to no image. */
  images?: (string | undefined)[];
}) {
  const p = useP();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [moved, setMoved] = useState(false);

  // Focus follows selection, but only once the reader has driven it themselves.
  useEffect(() => {
    if (moved) tabRefs.current[active]?.focus();
  }, [active, moved]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = steps.length - 1;
    const go = (next: number) => {
      event.preventDefault();
      setMoved(true);
      setActive(next);
    };
    if (event.key === "ArrowRight" || event.key === "ArrowDown") go(active === last ? 0 : active + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") go(active === 0 ? last : active - 1);
    else if (event.key === "Home") go(0);
    else if (event.key === "End") go(last);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <div
          role="tablist"
          aria-label={p("Recovery process steps")}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex flex-col"
        >
          {steps.map((step, i) => {
            const selected = i === active;
            return (
              <button
                key={step.number}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`process-tab-${step.number}`}
                aria-selected={selected}
                aria-controls={`process-panel-${step.number}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  setMoved(false);
                  setActive(i);
                }}
                className={cn(
                  "group relative flex items-center gap-4 border-s-2 py-4 ps-5 pe-4 text-start transition-colors duration-200",
                  selected
                    ? "border-brand-700 bg-white"
                    : "border-steel-200 hover:border-steel-400 hover:bg-white/60",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-sm font-medium tabular-nums transition-colors",
                    selected ? "text-brand-700" : "text-steel-500",
                  )}
                >
                  {step.number}
                </span>
                <span
                  className={cn(
                    "font-display text-[1.0625rem] font-semibold tracking-tight transition-colors",
                    selected ? "text-navy-900" : "text-steel-700 group-hover:text-navy-900",
                  )}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-7">
        {steps.map((step, i) => {
          const image = images?.[i];
          return (
            <div
              key={step.number}
              role="tabpanel"
              id={`process-panel-${step.number}`}
              aria-labelledby={`process-tab-${step.number}`}
              hidden={i !== active}
              tabIndex={0}
              className="rounded-lg border border-steel-200 bg-white p-6 focus-visible:outline-none sm:p-8"
            >
              {image ? (
                <div className="relative mb-7 aspect-[16/9] overflow-hidden rounded">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-brand-700">
                {p("Step {n} of {total}", { n: step.number, total: String(steps.length).padStart(2, "0") })}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-navy-900">
                {step.title}
              </h3>
              <p className="mt-4 content-en text-[1.0625rem] leading-relaxed text-steel-700">{step.body}</p>

              <div className="mt-8 flex items-center justify-between border-t border-steel-200 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setMoved(false);
                    setActive((a) => Math.max(0, a - 1));
                  }}
                  disabled={active === 0}
                  className="inline-flex min-h-[2.75rem] items-center rounded px-2 text-[0.9375rem] font-medium text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900 disabled:pointer-events-none disabled:text-steel-500"
                >
                  <span className="dir-arrow">&larr;</span> {p("Previous")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoved(false);
                    setActive((a) => Math.min(steps.length - 1, a + 1));
                  }}
                  disabled={active === steps.length - 1}
                  className="inline-flex min-h-[2.75rem] items-center rounded px-2 text-[0.9375rem] font-medium text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900 disabled:pointer-events-none disabled:text-steel-500"
                >
                  {p("Next")} <span className="dir-arrow">&rarr;</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
