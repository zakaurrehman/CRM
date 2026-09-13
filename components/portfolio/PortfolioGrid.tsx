import { portfolioFamilies, ferroAlloysCard } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { FamilyCard } from "./FamilyCard";

/**
 * Every material, one tile each, on a navy board.
 *
 * No group headings: IMS asked for each material separate at first glance.
 * The order does the grouping instead. Superalloys lead; the nickel, cobalt,
 * titanium and steel families follow, closed by ferroalloys; the reactive and
 * refractory metals come after.
 *
 * Three across below large screens and five from there, so fifteen tiles
 * always fill their rows — five rows of three, or three of five.
 *
 * `on-dark` sits on a wrapper, not on the list: the hairline rule switches to
 * its dark-ground colour through `.on-dark .grid-rule`, a descendant selector
 * that does not match when both classes are on one element.
 */
const cards = [
  ...portfolioFamilies.filter((f) => f.group === "alloys"),
  ferroAlloysCard,
  ...portfolioFamilies.filter((f) => f.group === "metals"),
];

export async function PortfolioGrid() {
  return (
    <div className="on-dark overflow-hidden rounded-lg bg-navy-950">
      <ul className="grid-rule grid grid-cols-3 lg:grid-cols-5">
        {cards.map((family, i) => (
          <Reveal as="li" key={family.slug} delay={(i % 5) * 50} className="bg-navy-950">
            <FamilyCard family={family} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
