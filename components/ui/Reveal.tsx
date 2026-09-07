"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveals children once, on first scroll into view.
 *
 * The hidden state lives in CSS under `.js .reveal` (see globals.css), which is
 * only active once the no-flash script in the layout has marked the document as
 * script-enabled. That means the server HTML renders fully visible: with
 * JavaScript disabled, or for anything that renders without scrolling, the
 * content is readable rather than stuck at opacity zero.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  id,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Forwarded so revealed blocks can still serve as deep-link anchors. */
  id?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return setShown(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      style={shown && delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", shown && "is-visible", className)}
    >
      {children}
    </Tag>
  );
}
