import Link from "next/link";
import { intermediates, type Intermediate, type IntermediateGroup } from "@/data/portfolio";
import { getP } from "@/lib/i18n/server";
import { Reveal } from "@/components/ui/Reveal";
import { SymbolBox } from "./FamilyCard";
import { cn } from "@/lib/utils";

/**
 * Powders, oxides and intermediaries, grouped by metal.
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
          <h3 className="font-display text-xl font-semibold tracking-tight text-navy-900 lg:text-2xl">
            {p("Powders, Oxides & Intermediaries")}
          </h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">
            {p("Not only metal and alloy scrap. We also take the intermediate products of refining and tool-making — oxides, tungstates, hydroxides, powders and filtercakes — and price them on contained metal.")}
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
                <SymbolBox symbol={group.symbol} />
              ) : (
                <span aria-hidden className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-steel-100 text-steel-400">
                  ·
                </span>
              )}
              {group.family ? (
                <Link
                  href={"/materials/" + group.family}
                  className="font-display text-[0.9375rem] font-semibold text-navy-900 underline decoration-steel-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700"
                >
                  {p(group.metal)}
                </Link>
              ) : (
                <span className="font-display text-[0.9375rem] font-semibold text-navy-900">{p(group.metal)}</span>
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
