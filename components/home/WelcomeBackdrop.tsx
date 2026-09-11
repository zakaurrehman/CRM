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
        The scrim.

        Deepening a photograph and lightening it are not equally costly. Bleached
        to carry dark type, an image goes flat and grey and the subject
        disappears — which is what kept happening here. Darkened, it keeps its
        contrast and its shape; a hot slab still glows, a turbine hall still has
        depth. So the picture runs at full strength and the type goes white.

        Two layers: an even navy wash for the floor, and a gradient weighted to
        the centre where the lockup sits. Both are navy rather than black, so
        the band belongs to the same palette as the header and the hero instead
        of reading as a grey hole between them.

        Measured, not judged by eye: see backdrop-contrast.mjs, which hides the
        text, samples the real pixels behind it across every frame of the
        rotation, and takes the worst.
      */}
      {/*
        The scrim, doing real work again: the type sits directly on the
        photograph, as it does on the original, and needs a floor under it.

        Deepening a photograph and lightening it are not equally costly.
        Bleached to carry dark type, an image goes flat and grey and the
        subject disappears — which is what IMS kept calling "too light".
        Darkened, it keeps its contrast and its shape; a hot slab still glows,
        a turbine hall still has depth. So the picture runs at full strength
        under a navy wash, and the type is white.

        Two layers: an even wash for the floor, and a gradient weighted to the
        middle where the lockup sits. Navy rather than black, so the band
        belongs to the same palette as the header and the hero instead of
        reading as a grey hole between them. Strengths are set by measurement —
        backdrop-contrast.mjs hides the text and samples the real pixels behind
        it across every frame — not by eye.
      */}
      <div className="absolute inset-0 bg-navy-950/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/30 via-navy-950/45 to-navy-950/70" />
    </div>
  );
}
