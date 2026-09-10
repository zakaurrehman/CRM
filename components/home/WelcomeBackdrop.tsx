"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Photographic backdrop for the welcome band.
 *
 * The original runs industrial photography behind the welcome lockup, washed
 * out far enough that dark type reads over it. This does not: the band is split
 * and the type has its own ground beside the picture rather than on top of it,
 * so the photography needs no wash and runs at full strength.
 *
 * Purely decorative — aria-hidden, no controls, nothing focusable. The section
 * content sits above it and never moves, so this is ambience rather than
 * anything a reader has to track. Under reduced motion it holds on the first
 * frame instead of cycling.
 */
export interface WelcomeSlide {
  src: string;
  /** Not rendered — decorative — but kept so the set is self-documenting. */
  subject: string;
}

const INTERVAL_MS = 3000;

export function WelcomeBackdrop({ slides }: { slides: WelcomeSlide[] }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAnimate(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!animate || slides.length < 2) return;
    const timer = setInterval(() => {
      /* A background quietly advancing in a tab nobody is looking at is work
         for nothing, and on a phone it is battery. */
      if (document.visibilityState === "visible") {
        setIndex((i) => (i + 1) % slides.length);
      }
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [animate, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          /* Only the first frame is eager: it is what a visitor sees on arrival,
             and the rest have three seconds to arrive before they are needed. */
          priority={i === 0}
          sizes="100vw"
          quality={72}
          className={cn(
            "object-cover transition-opacity duration-[1200ms] ease-swift",
            i === index ? "opacity-100" : "opacity-0",
            i === index && animate && "motion-safe:animate-slow-zoom",
          )}
        />
      ))}

      {/*
        No scrim.

        There was one, in two layers, and it was doing real work: the type used
        to sit on this photograph and needed a floor under it. In the split band
        the type has its own ground and nothing is printed over the picture, so
        a wash would only dull an image for no one's benefit. The photograph
        runs at full strength.

        The hairline is all that is left — it keeps the photo from butting into
        the light half with a raw seam.
      */}
      <div className="absolute inset-y-0 start-0 hidden w-px bg-navy-950/10 lg:block" />
    </div>
  );
}
