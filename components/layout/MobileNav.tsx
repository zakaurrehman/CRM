"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Full-height mobile drawer.
 *
 * Designed for the phone rather than scaled down from the desktop menu: sections
 * are accordions so the whole tree is reachable without nested screens, targets
 * are at least 44px tall, and the primary action sits within thumb reach at the
 * bottom. Focus is trapped while open and returned to the trigger on close.
 */
export function MobileNav({ items, open, onClose }: { items: NavItem[]; open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = previousOverflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  return (
    /* The wrapper is pinned to the viewport and clips its children. Without the
       clip, the closed panel — parked off-screen with translate-x-full — would
       extend the document's scrollable width by its own width on every page
       below `lg`, giving the whole site a horizontal scrollbar on mobile.
       `inert` keeps the closed panel out of the tab order and the a11y tree. */
    <div
      className="fixed inset-0 z-50 overflow-hidden lg:hidden"
      aria-hidden={!open}
      inert={!open}
      style={open ? undefined : { pointerEvents: "none" }}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-navy-950/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-lift transition-transform duration-300 ease-swift",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-steel-200 px-5">
          <Link href="/" onClick={onClose} aria-label="IMS Metals and Alloys, home">
            <Image
              src="/images/branding/ims-logo.png"
              alt="IMS Metals &amp; Alloys"
              width={3000}
              height={1455}
              sizes="160px"
              className="h-8 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded text-navy-900 hover:bg-steel-100"
          >
            <svg viewBox="0 0 20 20" aria-hidden className="h-5 w-5">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-5 py-2">
          <ul className="divide-y divide-steel-200">
            {items.map((item) => {
              const isOpen = expanded === item.label;
              if (!item.columns) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex min-h-[3.25rem] items-center text-[1.0625rem] font-medium text-navy-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    aria-expanded={isOpen}
                    className="flex min-h-[3.25rem] w-full items-center justify-between gap-3 text-left text-[1.0625rem] font-medium text-navy-900"
                  >
                    {item.label}
                    <svg
                      aria-hidden
                      viewBox="0 0 12 12"
                      className={cn(
                        "h-3 w-3 shrink-0 text-steel-500 transition-transform duration-200",
                        isOpen && "rotate-45",
                      )}
                    >
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div hidden={!isOpen} className="pb-3">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="mb-2 flex min-h-[2.5rem] items-center text-[0.9375rem] font-medium text-brand-700"
                    >
                      All {item.label.toLowerCase()}
                    </Link>
                    {item.columns.map((col) => (
                      <div key={col.heading} className="mb-3 last:mb-0">
                        <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                          {col.heading}
                        </p>
                        <ul>
                          {col.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                className="flex min-h-[2.75rem] items-center text-[0.9375rem] text-steel-700 hover:text-brand-700"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 border-t border-steel-200 bg-steel-50 px-5 py-5">
          <Link
            href="/contact"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded bg-brand-700 text-[0.9375rem] font-medium text-white"
          >
            Talk to IMS
          </Link>
          <a
            href="mailto:info@ims-metals.com"
            className="block text-center text-[0.875rem] text-steel-600 hover:text-brand-700"
          >
            info@ims-metals.com
          </a>
        </div>
      </div>
    </div>
  );
}
