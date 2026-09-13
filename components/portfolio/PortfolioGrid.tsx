import { portfolioFamilies, ferroAlloysCard } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { FamilyCard } from "./FamilyCard";

/**
 * Every material, one card each, flat.
 *
 * No group headings: IMS asked for each material separate at first glance.
 * The order does the grouping instead. Superalloys lead; the nickel, cobalt,
 * titanium and steel families follow, closed by ferroalloys; the reactive and
 * refractory metals come after. Four across on desktop.
 */
const cards = [
  ...portfolioFamilies.filter((f) => f.group === "alloys"),
  ferroAlloysCard,
  ...portfolioFamilies.filter((f) => f.group === "metals"),
];

export async function PortfolioGrid({ priority = false }: { priority?: boolean }) {
  return (
    <ul className="grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((family, i) => (
        <Reveal as="li" key={family.slug} delay={(i % 4) * 70} className="bg-white">
          <FamilyCard family={family} index={i} priority={priority && i < 4} />
        </Reveal>
      ))}
    </ul>
  );
}
