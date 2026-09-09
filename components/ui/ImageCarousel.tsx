"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Cross-fading image carousel.
 *
 * Written rather than pulled from a library: Swiper would add ~40 kB for a
 * cross-fade, arrows and dots. Every slide is in the DOM from the start, so the
 * whole set is present without JavaScript — only the cycling is scripted.
 *
 * Auto-advance stops on hover, on keyboard focus, while the tab is hidden, and
 * entirely under reduced-motion. The live region announces each change for
 * screen readers, and the dots are real buttons rather than decoration.
 */
export function ImageCarousel({
  slides,
  className,
  intervalMs = 5000,
  aspect = "aspect-[4/3]",
}: {
  slides: CarouselSlide[];
  className?: string;
  intervalMs?: number;
  aspect?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current || slides.length < 2) return;
    const id = setInterval(() => {
      // Don't cycle in a background tab; it only burns battery.
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [paused, intervalMs, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className={cn("group relative overflow-hidden", aspect, className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Operations gallery"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-[900ms] ease-swift",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={slide.src}
            alt={i === index ? slide.alt : ""}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={cn(
              "object-cover",
              i === index && "motion-safe:animate-slow-zoom",
            )}
          />
        </div>
      ))}

      {/* The caption sits ~56px up, so the scrim has to still be carrying at
          that height — a bright sky slide otherwise loses it. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />

      {slides[index].caption ? (
        <p className="absolute inset-x-5 bottom-14 text-[0.875rem] font-medium text-white drop-shadow">
          {slides[index].caption}
        </p>
      ) : null}

      {/* Announced to assistive tech; the visual change is obvious enough. */}
      <p aria-live="polite" className="sr-only">
        {`Image ${index + 1} of ${slides.length}: ${slides[index].alt}`}
      </p>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous image"
            className="absolute start-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-navy-950/75 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <svg viewBox="0 0 12 20" aria-hidden className="h-4 w-4 rtl:-scale-x-100">
              <path d="M10 1L2 10l8 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next image"
            className="absolute end-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-navy-950/75 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <svg viewBox="0 0 12 20" aria-hidden className="h-4 w-4 rtl:-scale-x-100">
              <path d="M2 1l8 9-8 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 ease-swift",
                  i === index ? "w-7 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
