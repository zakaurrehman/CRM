import Link from "next/link";
import { intermediates, type Intermediate, type IntermediateGroup } from "@/data/portfolio";
import { getP } from "@/lib/i18n/server";
import { routes } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ElementMark } from "./FamilyCard";
import { cn } from "@/lib/utils";

/**
 * One line and a door, for the homepage and the portfolio page: the kinds of
 * product, not the list. The list is on its own page so those two pages
 * stay about materials (IMS, 14 September 2026).
 */
export async function IntermediatesPreview() {
  const p = await getP();
  const kinds = ["APT", "Metal oxides", "Hydroxides", "Powders", "Filter cake", "Process residues"];

  return (
    <div className="flex flex-col gap-6 border-t border-steel-200 pt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
      <div className="max-w-2xl">
        <h3 className="font-display text-xl font-medium tracking-tight text-navy-900 lg:text-2xl">
          {p("Powders, Oxides & Intermediates")}
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">
          {kinds.map((k) => p(k)).join(" · ")}
        </p>
      </div>
      <Button href={routes.intermediates} variant="secondary" className="shrink-0">
        {p("Explore Powders & Intermediates")}
      </Button>
    </div>
  );
}

/**
 * Powders, oxides and intermediates, grouped by metal.
 *
 * One ruled row per metal: its symbol, its name, then the products as
 * formula-and-name pairs. The formula is the mark — APT, WO₃, Ta₂O₅ — because
 * that is what the material is called on a delivery note. Rows tied to a
 * material in the portfolio link to it.
 */
export async function Intermediates({
  groups = intermediates,
  heading = true,
  className,
}: {
  groups?: IntermediateGroup[];
  heading?: boolean;
  className?: string;
}) {
  const p = await getP();

  return (
    <div className={className}>
      {heading ? (
        <div className="max-w-3xl">
          <h3 className="font-display text-xl font-medium tracking-tight text-navy-900 lg:text-2xl">
            {p("Powders, Oxides & Intermediates")}
          </h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">
            {p("Not only metal and alloy scrap. We also take the intermediate products of refining and tool-making — oxides, tungstates, hydroxides, powders, filter cake and process residues — assessed on contained metal.")}
          </p>
        </div>
      ) : null}

      <ul className={cn("border-t border-steel-200", heading && "mt-8")}>
        {groups.map((group, i) => (
          <Reveal
            as="li"
            key={group.metal}
            delay={i * 40}
            className="grid gap-3 border-b border-steel-200 py-4 sm:grid-cols-12 sm:items-center sm:gap-6"
          >
            <div className="flex items-center gap-3 sm:col-span-3">
              {group.symbol ? (
                <ElementMark symbol={group.symbol} />
              ) : (
                <span aria-hidden className="inline-block min-w-[3rem] shrink-0" />
              )}
              {group.family ? (
                <Link
                  href={"/materials/" + group.family}
                  className="font-display text-[0.9375rem] font-medium text-navy-900 underline decoration-steel-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700"
                >
                  {p(group.metal)}
                </Link>
              ) : (
                <span className="font-display text-[0.9375rem] font-medium text-navy-900">{p(group.metal)}</span>
              )}
            </div>
            <ul className="flex flex-wrap gap-2 sm:col-span-9">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="inline-flex items-baseline gap-2 rounded-full bg-steel-100 px-3 py-1.5 text-[0.8125rem] text-steel-700"
                >
                  {item.formula ? <span className="font-mono font-medium text-navy-900">{item.formula}</span> : null}
                  <span>{p(item.name)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/**
 * The same items as a plain list, for a material's own page.
 *
 * There the metal is already the page, so repeating its symbol and name in
 * a grouped row said nothing — and one chip in a wide row read as empty.
 * A ruled list reads as a list: formula, name, one per line, and it grows
 * as IMS adds to it.
 */
export async function IntermediatesList({ items, className }: { items: Intermediate[]; className?: string }) {
  const p = await getP();
  return (
    <ul className={cn("border-t border-steel-200", className)}>
      {items.map((item, i) => (
        <Reveal as="li" key={item.name} delay={i * 40} className="flex items-baseline gap-4 border-b border-steel-200 py-3">
          {item.formula ? (
            <span className="w-20 shrink-0 font-mono text-[0.9375rem] font-medium text-navy-900">{item.formula}</span>
          ) : null}
          <span className="text-[0.9375rem] text-steel-700">{p(item.name)}</span>
        </Reveal>
      ))}
    </ul>
  );
}
