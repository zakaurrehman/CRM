"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Photographic backdrop for the welcome band.
 *
 * The original runs industrial photography behind the welcome lockup as a Ken
 * Burns slideshow, with the type directly on it. This does the same, with the
 * picture deepened rather than bleached so the type can be white — see the note
 * on the shade below — and two things the original does not have: a veil that
 * lifts off the picture on arrival, and a parallax against the scroll once it
 * has.
 *
 * Purely decorative — aria-hidden, no controls, nothing focusable. The section
 * content sits above it and never moves, so this is ambience rather than
 * anything a reader has to track. Under reduced motion it holds on the first
 * frame, does not drift, and the veil is simply absent.
 */
export interface WelcomeSlide {
  src: string;
  /** Not rendered — decorative — but kept so the set is self-documenting. */
  subject: string;
}

const INTERVAL_MS = 3000;

/**
 * How far the picture lags the scroll, as a fraction of scroll distance. 0.22
 * is felt rather than seen, which is the point: a background that visibly
 * slides is a gimmick, one that is very slightly heavier than the page is
 * depth.
 */
const PARALLAX = 0.22;
/**
 * The picture is oversized vertically by this much on each edge so that the
 * parallax offset never exposes the ground behind it. The offset is clamped to
 * the same figure.
 */
const BLEED = 0.14;

export function WelcomeBackdrop({ slides }: { slides: WelcomeSlide[] }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

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

  /* Parallax. One passive scroll listener, one transform per frame, and only
     while the section is on screen — there is nothing to move once it has
     scrolled past. transform rather than top, so it stays on the compositor. */
  useEffect(() => {
    const el = stage.current;
    const section = el?.closest("section");
    if (!animate || !el || !section) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const limit = r.height * BLEED;
      const offset = Math.max(-limit, Math.min(limit, -r.top * PARALLAX));
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [animate]);

  if (slides.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* The stage the parallax moves. Taller than the section by BLEED on
          each edge, so the offset never shows the ground behind it. */}
      <div
        ref={stage}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `${-BLEED * 100}%`, bottom: `${-BLEED * 100}%` }}
      >
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            /* Only the first frame is eager: it is what a visitor sees on
               arrival, and the rest have three seconds to arrive before they
               are needed. */
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
      </div>

      {/*
        The shade, doing real work: the type sits directly on the photograph
        and needs a floor under it.

        It is neutral — black, not navy — on IMS's instruction that the
        photograph show in its own colours. Black lowers value without moving
        hue, so the hot slab stays orange and the turbine hall stays steel and
        teal; a navy wash turned both blue.

        And it is local rather than even. An even wash strong enough for white
        type would darken the whole frame. Instead a light even floor keeps the
        edges near their original values, a soft vignette deepens only the
        column the lockup sits in, and a gradient grounds the bottom edge.
        Strengths are set by measurement — backdrop-contrast.mjs hides the text
        and samples the real pixels behind it across every frame — not by eye.
      */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="welcome-vignette absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

      {/*
        The veil. The photograph is not faded in; a dark sheet is lifted off
        it. The difference is what the eye sees first — the ground, already
        there, being uncovered — and it is the first beat of the sequence the
        lockup then follows. Black, like the shade, so nothing tints on the
        way in. Absent under reduced motion.
      */}
      <div className="veil-lift absolute inset-0 bg-black" />
    </div>
  );
}
