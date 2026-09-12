import Link from "next/link";
import { ferroAlloys } from "@/data/portfolio";
import { getP } from "@/lib/i18n/server";
import { Reveal } from "@/components/ui/Reveal";
import { SymbolBox } from "./FamilyCard";

/**
 * The ferro-alloys section: five tiles, formula then name, all opening the
 * one ferro-alloys page. Compact by design — these are designations, and a
 * photograph of ferro-tungsten lumps would tell a buyer nothing the formula
 * does not.
 */
export async function FerroAlloys({ heading = true }: { heading?: boolean }) {
  const p = await getP();

  return (
    <div>
      {heading ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h3 className="font-display text-xl font-semibold tracking-tight text-navy-900 lg:text-2xl">{p("Ferro Alloys")}</h3>
          <p className="text-[0.9375rem] text-steel-600">{p("Available in all sizes, packings and specifications.")}</p>
        </div>
      ) : null}
      <ul className={heading ? "mt-6 grid grid-rule grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid grid-rule grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}>
        {ferroAlloys.map((alloy, i) => (
          <Reveal as="li" key={alloy.mark} delay={i * 50} className="bg-white">
            <Link
              href={"/materials/ferro-alloys#" + alloy.mark.toLowerCase()}
              className="group flex h-full flex-col gap-3 p-5 transition-colors hover:bg-steel-50"
            >
              <SymbolBox symbol={alloy.mark} className="self-start" />
              <span className="font-display text-[0.9375rem] font-semibold leading-snug text-navy-900 transition-colors group-hover:text-brand-700">
                {p(alloy.name)}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
