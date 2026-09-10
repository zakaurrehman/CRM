"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Photographic backdrop for the welcome band, matching the original site.
 *
 * The original runs industrial photography behind the welcome lockup, washed
 * out far enough that the dark type still reads cleanly over it. That wash is
 * the whole trick: at full strength either the picture wins and the words
 * become unreadable, or the words win and the picture looks like a mistake.
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
        The wash.

        A flat scrim heavy enough to protect the type erases the photograph, and
        one light enough to show it leaves the type sitting on whatever happens
        to be underneath. So it is graded instead: strongest at the centre where
        the lockup sits, easing off towards the edges where the picture can be
        seen. The type keeps its contrast and the photograph still reads, which
        is what the original does.

        Tuned against the contrast checker rather than by eye — the navy on this
        is measured, not assumed.
      */}
      <div className="absolute inset-0 bg-white/28" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_62%_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.85)_62%,rgba(255,255,255,0.35)_100%)]" />
    </div>
  );
}
