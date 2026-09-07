import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Breadcrumb trail. The final crumb is the current page and is not a link.
 * Pair with `breadcrumbSchema` for the matching structured data.
 */
export function Breadcrumbs({ trail, tone = "light" }: { trail: Crumb[]; tone?: "light" | "dark" }) {
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
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={cn(
                    "transition-colors",
                    tone === "dark" ? "text-steel-300 hover:text-white" : "text-steel-500 hover:text-brand-700",
                  )}
                >
                  {crumb.name}
                </Link>
              )}
              {!last && (
                <span aria-hidden className={tone === "dark" ? "text-steel-500" : "text-steel-300"}>
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
