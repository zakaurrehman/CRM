"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";
import { SearchTrigger } from "./SearchTrigger";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n/provider";

export function Header({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  // Close any open menu on route change.
  useEffect(() => {
    setOpenIndex(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mega menu; so does a pointer press outside the header.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    /* The boundary must be the whole header, not just the nav row: the mega
       menu panels are siblings of that row, so a narrower boundary treats a
       press on a panel link as "outside", tears the panel down on mousedown,
       and the click never reaches the link. */
    const onPointerDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenIndex(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [openIndex]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenIndex(null), 120);
  };

  const { t } = useI18n();

  const isActive = (item: NavItem) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <>
      {/*
        Utility strip. Outside the sticky header on purpose: it introduces the
        company and the contact route on arrival, then scrolls away.

        Inside the header it was stuck at the top of the viewport forever, so it
        cost its full height on every page at every scroll position — and it put
        the real header height (109px) above the 96px `scroll-padding-top`
        derived from `--header-h`, which left every deep-linked heading sitting
        behind the bar it had just scrolled to.
      */}
      <div className="hidden border-b border-steel-200 bg-navy-950 text-steel-300 lg:block">
        <Container className="flex h-9 items-center justify-between text-[0.75rem]">
          <p className="font-mono uppercase tracking-[0.14em] text-steel-400">
            Metals, alloys &amp; recovery &mdash; Tallinn, Estonia
          </p>
          <a
            href="mailto:info@ims-metals.com"
            className="on-dark inline-flex min-h-[1.5rem] items-center rounded-sm text-steel-300 transition-colors hover:text-white"
          >
            info@ims-metals.com
          </a>
        </Container>
      </div>

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300",
          scrolled || openIndex !== null ? "shadow-subtle" : "",
        )}
      >
        <Container>
          <div className="flex h-[var(--header-h)] items-center justify-between gap-6">
            {/*
              The mark itself is untouched — the gradient lockup as IMS drew it.
              What changed is the presentation: it was set at 36–40px, which left
              the "METALS & ALLOYS" line about five pixels tall and effectively
              illegible, so half the logo was decoration. At 44–52px the full
              lockup reads, and the header still has room above and below.

              The hover is deliberately slight. A logo is a signature, not a
              button; it should acknowledge the pointer, not perform.
            */}
            <Link
              href="/"
              className="group/logo shrink-0 rounded-sm"
              aria-label="IMS Metals and Alloys, home"
            >
              <Image
                src="/images/branding/ims-logo.png"
                alt="IMS Metals &amp; Alloys"
                width={3000}
                height={1455}
                priority
                sizes="220px"
                className="h-11 w-auto transition-[transform,filter] duration-300 ease-swift motion-safe:group-hover/logo:scale-[1.03] group-hover/logo:[filter:drop-shadow(0_2px_10px_rgba(0,104,176,0.28))] sm:h-13"
              />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {items.map((item, i) => {
                  const hasMenu = Boolean(item.columns);
                  const open = openIndex === i;
                  return (
                    <li
                      key={item.i18nKey ? t("nav", item.i18nKey) : item.label}
                      onMouseEnter={() => {
                        if (!hasMenu) return;
                        cancelClose();
                        setOpenIndex(i);
                      }}
                      onMouseLeave={() => {
                        if (hasMenu) scheduleClose();
                      }}
                      className="relative"
                    >
                      {hasMenu ? (
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={menuId + "-" + i}
                          onClick={() => setOpenIndex(open ? null : i)}
                          className={cn(
                            "flex h-[var(--header-h)] items-center gap-1.5 px-3.5 text-[0.9375rem] font-medium transition-colors",
                            open || isActive(item) ? "text-brand-700" : "text-navy-900 hover:text-brand-700",
                          )}
                        >
                          {item.i18nKey ? t("nav", item.i18nKey) : item.label}
                          <svg
                            aria-hidden
                            viewBox="0 0 10 6"
                            className={cn("h-1.5 w-2.5 transition-transform duration-200", open && "rotate-180")}
                          >
                            <path
                              d="M1 1l4 4 4-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-[var(--header-h)] items-center px-3.5 text-[0.9375rem] font-medium transition-colors",
                            isActive(item) ? "text-brand-700" : "text-navy-900 hover:text-brand-700",
                          )}
                        >
                          {item.i18nKey ? t("nav", item.i18nKey) : item.label}
                        </Link>
                      )}
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute inset-x-3 bottom-0 h-0.5 origin-left bg-brand-700 transition-transform duration-300 ease-swift rtl:origin-right",
                          open || isActive(item) ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop only here; the drawer carries its own copy so the
                  control is never more than one tap away on a phone. */}
              <div className="hidden lg:block">
                <LanguageSwitcher tone="light" />
              </div>
              <SearchTrigger />
              <Link
                href="/contact"
                className="hidden h-10 items-center rounded bg-brand-700 px-4 text-[0.9375rem] font-medium text-white shadow-subtle transition-colors hover:bg-brand-800 sm:inline-flex"
              >
                {t("nav", "talkToIms")}
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label={t("nav", "openMenu")}
                aria-expanded={mobileOpen}
                className="-me-2 inline-flex h-11 w-11 items-center justify-center rounded text-navy-900 transition-colors hover:bg-steel-100 lg:hidden"
              >
                <svg viewBox="0 0 20 20" aria-hidden className="h-5 w-5">
                  <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {items.map((item, i) =>
            item.columns ? (
              <MegaMenu
                key={item.i18nKey ? t("nav", item.i18nKey) : item.label}
                id={menuId + "-" + i}
                item={item}
                open={openIndex === i}
                onEnter={cancelClose}
                onLeave={scheduleClose}
                onNavigate={() => setOpenIndex(null)}
              />
            ) : null,
          )}
        </Container>
      </header>

      {/* Deliberately a sibling of <header>, not a child. The header carries
          `backdrop-blur`, and an element with a backdrop-filter becomes the
          containing block for its `position: fixed` descendants — which would
          resolve the drawer's `inset-0` against the header's 72px strip rather
          than the viewport, and its overflow clip would then cut the drawer off
          just below the logo. */}
      <MobileNav items={items} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function MegaMenu({
  id,
  item,
  open,
  onEnter,
  onLeave,
  onNavigate,
}: {
  id: string;
  item: NavItem;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onNavigate: () => void;
}) {
  if (!item.columns) return null;
  const wide = item.columns.length > 2;

  return (
    <div
      id={id}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      /* The open state must be expressed through the display utilities alone. A
         `hidden` attribute would be overridden by `lg:block`, leaving the panel
         permanently visible on desktop. Closed collapses to display:none at every
         breakpoint, which also keeps it out of the accessibility tree. */
      className={cn(
        "absolute inset-x-0 top-full z-40 animate-slide-down border-t border-steel-200 bg-white shadow-lift",
        open ? "hidden lg:block" : "hidden",
      )}
    >
      <Container>
        <div className={cn("grid gap-x-10 gap-y-8 py-10", item.feature ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          <div
            className={cn(
              "grid gap-x-10 gap-y-8 lg:col-span-3",
              wide ? "sm:grid-cols-3" : "sm:grid-cols-2",
            )}
          >
            {item.columns.map((col) => (
              <div key={col.heading}>
                <p className="mb-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                  {col.heading}
                </p>
                <ul className="space-y-0.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="group -mx-2 block rounded px-2 py-1.5 transition-colors hover:bg-steel-50"
                      >
                        <span className="block text-[0.9375rem] font-medium text-navy-900 group-hover:text-brand-700">
                          {link.label}
                        </span>
                        {link.description ? (
                          <span className="mt-0.5 block text-[0.8125rem] leading-snug text-steel-500">
                            {link.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {item.feature ? (
            <Link
              href={item.feature.href}
              onClick={onNavigate}
              className="group relative flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-md bg-navy-950 p-6 text-white"
            >
              <Image
                src={item.feature.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 320px, 0px"
                className="object-cover opacity-45 transition-transform duration-700 ease-swift group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent"
              />
              <div className="relative">
                <p className="font-display text-lg font-semibold leading-tight text-white">{item.feature.title}</p>
                <p className="mt-2 text-[0.8125rem] leading-snug text-steel-300">{item.feature.body}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-300">
                  {item.feature.cta}
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                    <span className="dir-arrow">&rarr;</span>
                  </span>
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
