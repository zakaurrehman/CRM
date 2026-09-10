"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  /** Shown to nobody — these are decorative backdrops; the headline carries the meaning. */
  label: string;
}

const INTERVAL_MS = 6500;

/**
 * Full-bleed hero backdrop that cross-fades between sector photographs.
 *
 * Three things matter here and they pull against each other:
 *
 * 1. LCP. The first frame is rendered by the server with `priority`, exactly as
 *    the single static image used to be. The remaining frames are not mounted
 *    until after hydration settles, so they never compete with it for bandwidth.
 * 2. No-JS. With scripting off the first frame is all there is — which is the
 *    behaviour this replaced, so nothing is lost.
 * 3. WCAG 2.2.2. Anything that moves on a timer needs a way to stop it, so the
 *    indicator row doubles as a pause control. Rotation also stops on hover,
 *    on focus, in a hidden tab, and entirely under reduced-motion.
 */
export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* Hold the other frames back until the hero image has had the network to
     itself. 600ms is past hydration on a slow connection without being a
     visible wait before the first transition at 6.5s. */
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  /* Hover and the pause button freeze the fill where it stands; reduced motion
     and the pre-hydration window stop it running at all, which is why the two
     are kept apart rather than folded into one flag. */
  const advancing = !paused && !hovered && !reduced;
  const running = ready && advancing && slides.length > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [running, slides.length]);

  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {slides.map((slide, i) => {
          const first = i === 0;
          if (!first && !ready) return null;
          const active = i === index;
          return (
            <Image
              key={slide.src}
              src={slide.src}
              alt=""
              fill
              priority={first}
              fetchPriority={first ? "high" : "low"}
              loading={first ? undefined : "eager"}
              sizes="100vw"
              quality={78}
              className={cn(
                "object-cover transition-opacity duration-[1400ms] ease-swift",
                active ? "opacity-100" : "opacity-0",
                /* Re-adding the class restarts the animation, so each frame gets
                   its own drift rather than inheriting the previous one's. */
                active && "motion-safe:animate-slow-zoom",
              )}
            />
          );
        })}
      </div>

      {/* Screen readers get the change announced even though the images are
          decorative — otherwise the pause control has nothing to refer to. */}
      <div aria-live="polite" className="sr-only">
        {slides[index].label}
      </div>

      {slides.length > 1 ? (
        <div
          /* Out of the picture until you reach for them: revealed on hover, and
             on keyboard focus so tabbing still finds the pause control. Pointer
             events go with the opacity so there is no invisible tap target on
             touch, where reduced-motion is the fallback for stopping motion. */
          className="pointer-events-none absolute end-5 top-6 z-10 flex items-center gap-3 opacity-0 transition-opacity duration-300 ease-swift focus-within:pointer-events-auto focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 lg:end-8 lg:top-8"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
        >
          <div className="flex items-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={slide.label}
                aria-current={i === index}
                className="group/dot relative h-8 w-9 focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full transition-colors duration-300",
                    i === index ? "bg-white/30" : "bg-white/25 group-hover/dot:bg-white/50",
                  )}
                >
                  {/* Fills across the dwell time, so the rotation is legible
                      rather than something that just happens to you. */}
                  <span
                    className={cn(
                      "block h-full origin-left rounded-full bg-white rtl:origin-right",
                      i !== index && "scale-x-0",
                      /* Under reduced motion the bar simply sits full: it still
                         has to say which frame you are on. */
                      i === index && (reduced ? "scale-x-100" : "animate-indicator"),
                    )}
                    style={
                      i === index && !reduced
                        ? {
                            animationDuration: `${INTERVAL_MS}ms`,
                            animationPlayState: advancing ? "running" : "paused",
                          }
                        : undefined
                    }
                  />
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume image rotation" : "Pause image rotation"}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors duration-200 hover:border-white/50 hover:text-white"
          >
            {paused ? (
              <svg viewBox="0 0 10 12" aria-hidden className="h-3 w-3">
                <path d="M1 1l8 5-8 5z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 12" aria-hidden className="h-3 w-3">
                <path d="M1 1h2.5v10H1zM6.5 1H9v10H6.5z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      ) : null}
    </>
  );
}
