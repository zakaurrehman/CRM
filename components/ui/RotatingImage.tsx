"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MAX_FAMILY_IMAGES } from "@/data/portfolio";

/**
 * A photograph that quietly cycles through up to four frames.
 *
 * This is the "3–4 pics that switch around" IMS asked for on each family
 * card, and it is ambience rather than a control: no dots, no arrows, nothing
 * to operate. What it does do, because motion on a timer needs manners:
 *
 * - Frame 1 is server-rendered and is all a no-JS visitor sees, which is the
 *   card as it was before — nothing is lost.
 * - The other frames are not fetched until the card scrolls into view, so a
 *   grid of twelve cards does not pull thirty-odd images on page load.
 * - Rotation pauses while the pointer or keyboard focus is on the card, so a
 *   picture does not change under someone reading the label beside it.
 * - It holds on frame 1 under prefers-reduced-motion, and does not advance in
 *   a hidden tab.
 * - Cards are offset by `offsetMs` so a grid does not blink in unison; the
 *   caller passes a stagger derived from the card's position.
 *
 * With a single frame there is nothing to do, and this is just an image.
 */

const INTERVAL_MS = 5000;

export function RotatingImage({
  images,
  alt = "",
  sizes,
  offsetMs = 0,
  priority = false,
  className,
}: {
  images: string[];
  alt?: string;
  sizes: string;
  /** Delay before the first change, so neighbouring cards do not move together. */
  offsetMs?: number;
  priority?: boolean;
  className?: string;
}) {
  const frames = images.slice(0, MAX_FAMILY_IMAGES);
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* Mount the remaining frames only once the card has been on screen. */
  useEffect(() => {
    const el = root.current;
    if (!el || frames.length < 2) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [frames.length]);

  /* The pause listens on the card, not the picture: the label beside the
     photograph is what someone is reading when it should not change. The
     nearest link or article is the card. */
  useEffect(() => {
    const el = root.current;
    const card = el?.closest("a, article, li") ?? el;
    if (!card) return;
    const on = () => setHeld(true);
    const off = () => setHeld(false);
    card.addEventListener("mouseenter", on);
    card.addEventListener("mouseleave", off);
    card.addEventListener("focusin", on);
    card.addEventListener("focusout", off);
    return () => {
      card.removeEventListener("mouseenter", on);
      card.removeEventListener("mouseleave", off);
      card.removeEventListener("focusin", on);
      card.removeEventListener("focusout", off);
    };
  }, []);

  const running = seen && !held && !reduced && frames.length > 1;

  useEffect(() => {
    if (!running) return;
    let interval: number | undefined;
    const tick = () => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % frames.length);
    };
    /* First change after the offset, then on the regular cadence. */
    const lead = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, INTERVAL_MS);
    }, INTERVAL_MS + offsetMs);
    return () => {
      window.clearTimeout(lead);
      if (interval) window.clearInterval(interval);
    };
  }, [running, frames.length, offsetMs]);

  if (frames.length === 0) return null;

  return (
    <div ref={root} className={cn("absolute inset-0 overflow-hidden", className)}>
      {frames.map((src, i) => {
        const first = i === 0;
        if (!first && !seen) return null;
        return (
          <Image
            key={src}
            src={src}
            alt={first ? alt : ""}
            fill
            priority={first && priority}
            sizes={sizes}
            quality={78}
            className={cn(
              "object-cover transition-opacity duration-[1200ms] ease-swift",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        );
      })}
    </div>
  );
}
