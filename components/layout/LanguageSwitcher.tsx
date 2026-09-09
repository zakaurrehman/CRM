"use client";

import { useEffect, useRef, useState } from "react";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Language selector.
 *
 * A disclosure rather than a <select>: the list has to show each language in its
 * own script, and a native select cannot be styled to sit in the header without
 * looking like a form control that wandered in.
 *
 * Keyboard behaviour follows the menu-button pattern — Escape closes and returns
 * focus, arrows move through the options, and the trigger reports expansion.
 */
export function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Move into the list when it opens, starting on the current language.
  useEffect(() => {
    if (!open) return;
    const index = locales.indexOf(locale);
    itemRefs.current[index === -1 ? 0 : index]?.focus();
  }, [open, locale]);

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const last = locales.length - 1;
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    const move = (next: number) => {
      event.preventDefault();
      itemRefs.current[next]?.focus();
    };
    if (event.key === "ArrowDown") move(current >= last ? 0 : current + 1);
    else if (event.key === "ArrowUp") move(current <= 0 ? last : current - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(last);
  };

  const choose = (next: Locale) => {
    setLocale(next);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const dark = tone === "dark";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t("language", "change")} — ${t("language", "current")}: ${localeMeta[locale].english}`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[0.75rem] font-medium transition-colors",
          dark
            ? "text-steel-300 hover:text-white"
            : "text-steel-600 hover:text-brand-700",
        )}
      >
        <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1.5 8h13M8 1.5c1.8 2 2.7 4.1 2.7 6.5S9.8 12.5 8 14.5C6.2 12.5 5.3 10.4 5.3 8S6.2 3.5 8 1.5z"
            fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <span className="uppercase tracking-[0.08em]">{locale}</span>
        <svg viewBox="0 0 10 6" aria-hidden className={cn("h-1.5 w-2.5 transition-transform duration-200", open && "rotate-180")}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("language", "label")}
          onKeyDown={onListKeyDown}
          /* `end-0` rather than `right-0`: in Hebrew the header mirrors, and the
             panel has to hang from the trigger's trailing edge either way. */
          className="absolute end-0 top-[calc(100%+0.5rem)] z-50 min-w-[11rem] overflow-hidden rounded-md border border-steel-200 bg-white py-1 shadow-lift motion-safe:animate-slide-down"
        >
          {locales.map((code, i) => {
            const active = code === locale;
            return (
              <button
                key={code}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                lang={localeMeta[code].tag}
                dir={localeMeta[code].dir}
                onClick={() => choose(code)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3.5 py-2 text-start text-[0.875rem] transition-colors",
                  active ? "bg-brand-50 font-medium text-brand-800" : "text-navy-900 hover:bg-steel-50",
                )}
              >
                <span>{localeMeta[code].native}</span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-steel-500">
                  {code}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
