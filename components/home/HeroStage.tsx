"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "intro" | "leaving" | "done";

/**
 * Runs the homepage hero's opening sequence: the welcome lockup appears over
 * the photography, holds, then lifts away as the hero content rises in and
 * stays. It does not loop — the hero carries the search and quotation buttons,
 * and content that keeps disappearing is content nobody can act on.
 *
 * The starting phase is "idle" rather than "intro" so the server and the first
 * client render agree. Everything below is driven by a `data-phase` attribute
 * and styled in globals.css, which means the markup never changes between
 * phases and there is nothing for hydration to disagree about.
 *
 * Two ways this can not run, both of which land on the hero content already
 * visible rather than on a blank stage:
 *   - no JavaScript: the attribute is never set, and "idle" styles the hero
 *     content as fully visible with the intro hidden
 *   - reduced motion: the effect jumps straight to "done"
 */
export function HeroStage({
  intro,
  children,
}: {
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("done");
      return;
    }

    /* A visitor who arrives already scrolled — a reload part-way down, or a
       back navigation — would otherwise sit through an intro they cannot see. */
    if (window.scrollY > 120) {
      setPhase("done");
      return;
    }

    setPhase("intro");
    timers.current.push(setTimeout(() => setPhase("leaving"), 2600));
    timers.current.push(setTimeout(() => setPhase("done"), 3300));

    const cancel = () => setPhase("done");
    /* Any intent to engage ends the intro immediately. Waiting out an animation
       to reach a search box is the thing that makes intros feel like an
       obstacle rather than a flourish. */
    window.addEventListener("wheel", cancel, { passive: true, once: true });
    window.addEventListener("touchstart", cancel, { passive: true, once: true });
    window.addEventListener("keydown", cancel, { once: true });
    window.addEventListener("pointerdown", cancel, { once: true });

    return () => {
      for (const t of timers.current) clearTimeout(t);
      timers.current = [];
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("pointerdown", cancel);
    };
  }, []);

  return (
    <div className="hero-stage" data-phase={phase}>
      {/*
        aria-hidden throughout. The same words are in the DOM once already — the
        logo's alt text and the objective line further down the page — and a
        screen reader should not be made to sit through a decorative sequence
        before reaching the headline. Nothing here is focusable.
      */}
      <div className="hero-intro" aria-hidden>
        {intro}
      </div>

      <div className="hero-main">{children}</div>
    </div>
  );
}
