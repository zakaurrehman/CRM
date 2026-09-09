import Link from "next/link";
import { getP } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Breadcrumb trail. The final crumb is the current page and is not a link.
 * Pair with `breadcrumbSchema` for the matching structured data.
 */
export async function Breadcrumbs({ trail, tone = "light" }: { trail: Crumb[]; tone?: "light" | "dark" }) {
  /* Crumb labels are page names defined at module scope; wrapping them here
     translates the trail without every page having to do it. */
  const p = await getP();

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem]">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {last ? (
                <span
                  aria-current="page"
                  className={cn("font-medium", tone === "dark" ? "text-white" : "text-navy-900")}
                >
                  {p(crumb.name)}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={cn(
                    "transition-colors",
                    tone === "dark" ? "text-steel-300 hover:text-white" : "text-steel-500 hover:text-brand-700",
                  )}
                >
                  {p(crumb.name)}
                </Link>
              )}
              {!last && (
                /* Decorative, and hidden from assistive tech — but it still has
                   to be seen, so both tones clear 4.5:1 rather than relying on
                   the exemption for punctuation. */
                <span aria-hidden className={tone === "dark" ? "text-steel-400" : "text-steel-500"}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
