"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface HeroMotion {
  /** Explicitly paused by the visitor, through the hero's pause control. */
  paused: boolean;
  setPaused: Dispatch<SetStateAction<boolean>>;
  /** Pointer is over the hero, or focus is inside it. */
  hovered: boolean;
  setHovered: Dispatch<SetStateAction<boolean>>;
  /** The visitor asked for reduced motion. */
  reduced: boolean;
  /** Nothing on a timer should advance. */
  frozen: boolean;
}

/**
 * One pause state for everything that moves in the hero.
 *
 * The backdrop rotates and the welcome/hero cycle runs on its own timer. Left
 * separate they would need a pause control each, sitting next to one another
 * and doing almost the same thing. Sharing the state means the single control
 * in the corner stops both, which is what someone reaching for it wants.
 *
 * Defaults are the safe ones: outside a provider nothing is paused and nothing
 * is reduced, so a component rendered on its own behaves as it did before.
 */
const Context = createContext<HeroMotion | null>(null);

export function HeroMotionProvider({ children }: { children: React.ReactNode }) {
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

  const value = useMemo<HeroMotion>(
    () => ({
      paused,
      setPaused,
      hovered,
      setHovered,
      reduced,
      frozen: paused || hovered || reduced,
    }),
    [paused, hovered, reduced],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useHeroMotion(): HeroMotion {
  const value = useContext(Context);
  if (value) return value;
  // Standalone fallback, so the hero components still work outside a provider.
  return {
    paused: false,
    setPaused: () => {},
    hovered: false,
    setHovered: () => {},
    reduced: false,
    frozen: false,
  };
}
