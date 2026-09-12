import { portfolioFamilies } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { FamilyCard } from "./FamilyCard";

/**
 * The twelve materials, one card each, flat.
 *
 * No group headings: IMS asked for each material separate at first glance,
 * and the intro's own order — nickel and cobalt alloys, then steels, then
 * titanium and the refractory metals — already reads left to right without
 * them. Four across on desktop makes three even rows.
 */
export async function PortfolioGrid({ priority = false }: { priority?: boolean }) {
  return (
    <ul className="grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
      {portfolioFamilies.map((family, i) => (
        <Reveal as="li" key={family.slug} delay={(i % 4) * 70} className="bg-white">
          <FamilyCard family={family} index={i} priority={priority && i < 4} />
        </Reveal>
      ))}
    </ul>
  );
}
