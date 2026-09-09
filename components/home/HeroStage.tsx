"use client";

import { useEffect, useRef, useState } from "react";
import { useHeroMotion } from "./HeroMotion";

type Phase = "idle" | "intro" | "leaving" | "done" | "returning";

/** How long each state holds before the cycle moves on. */
const WELCOME_MS = 3000;
const HERO_MS = 9000;
/** Long enough for the two layers to cross over without either snapping. */
const CROSSFADE_MS = 800;

/**
 * Runs the homepage hero's welcome sequence: the welcome lockup plays over the
 * photography, hands over to the hero content, and after a while returns.
 *
 * The hero holds the alloy search and the quotation button, so it dwells three
 * times as long as the welcome and is what the cycle rests on whenever anything
 * interrupts. Cycling content that carries the page's only calls to action is a
 * real cost, and these are the things that keep it from being one:
 *
 *   - the cycle stops for good the moment anyone scrolls, taps, or presses a key
 *   - it freezes while the pointer is over the hero or focus is inside it
 *   - the hero's pause control stops it, along with the backdrop rotation
 *   - reduced motion skips it entirely
 *
 * The starting phase is "idle" so the server and the first client render agree.
 * Everything is driven by a `data-phase` attribute and styled in globals.css, so
 * the markup never changes between phases and hydration has nothing to argue
 * with. Without JavaScript the attribute is never set, and "idle" styles the
 * hero content as fully visible with the welcome hidden.
 */
export function HeroStage({
  intro,
  children,
}: {
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const { frozen, reduced } = useHeroMotion();
  /* Once someone engages, the cycle is finished for the rest of the visit —
     distinct from `frozen`, which is a temporary hold. */
  const [stopped, setStopped] = useState(false);
  /* Local, not the shared hover: resting the pointer on the hero should hold the
     welcome back, but it should not also freeze the backdrop, which is ambience
     rather than something anyone is trying to read. */
  const [engaged, setEngaged] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  };

  // ---- start, and stop for good on the first sign of engagement
  useEffect(() => {
    if (reduced) {
      setPhase("done");
      setStopped(true);
      return;
    }

    /* Arriving already scrolled — a reload part-way down, or a back navigation —
       means the intro would play where nobody can see it. */
    if (window.scrollY > 120) {
      setPhase("done");
      setStopped(true);
      return;
    }

    setPhase("intro");

    const stop = () => {
      setStopped(true);
      setPhase("done");
    };
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });
    window.addEventListener("pointerdown", stop, { once: true });

    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("pointerdown", stop);
    };
  }, [reduced]);

  // ---- advance the cycle
  useEffect(() => {
    clearTimers();
    if (stopped || frozen || engaged || phase === "idle") return;

    const after = (ms: number, next: Phase) => {
      timers.current.push(setTimeout(() => setPhase(next), ms));
    };

    if (phase === "intro") after(WELCOME_MS, "leaving");
    else if (phase === "leaving") after(CROSSFADE_MS, "done");
    else if (phase === "done") after(HERO_MS, "returning");
    else if (phase === "returning") after(CROSSFADE_MS, "intro");

    return clearTimers;
  }, [phase, stopped, frozen, engaged]);

  useEffect(() => clearTimers, []);

  return (
    <div
      className="hero-stage"
      data-phase={phase}
      /* Reading the hero, or tabbing to Search grades or Request a quotation,
         holds the cycle where it is. Nothing should swap out from under someone
         mid-sentence or mid-reach. */
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={() => setEngaged(false)}
    >
      {/*
        aria-hidden throughout, in every phase. The same words are in the DOM
        already through the logo's alt text, and nothing here is focusable, so a
        screen reader is never made to sit through a decorative cycle — and the
        headline it does read never moves.
      */}
      <div className="hero-intro" aria-hidden>
        {intro}
      </div>

      <div className="hero-main">{children}</div>
    </div>
  );
}
