import { portfolioGroups } from "@/data/portfolio";
import { familiesInGroup } from "@/lib/portfolio";
import { getP } from "@/lib/i18n/server";
import { Reveal } from "@/components/ui/Reveal";
import { FamilyCard } from "./FamilyCard";

/**
 * The portfolio, group by group.
 *
 * Each group is a band: its heading on the left, its families in a hairline
 * grid on the right. The heading column is what makes Ferro Alloys and
 * Refractory metals read as sections of the business rather than as two tiles
 * among twelve — which is what IMS asked for when it asked where they were.
 */
export async function PortfolioGrid({ priority = false }: { priority?: boolean }) {
  const p = await getP();
  let position = 0;

  return (
    <div className="divide-y divide-steel-200 border-y border-steel-200">
      {portfolioGroups.map((group) => {
        const families = familiesInGroup(group.id);
        const start = position;
        position += families.length;
        return (
          <section key={group.id} aria-labelledby={"group-" + group.id} className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-10 lg:py-12">
            <Reveal className="lg:col-span-3">
              <h3 id={"group-" + group.id} className="font-display text-xl font-semibold tracking-tight text-navy-900 lg:text-2xl">
                {p(group.name)}
              </h3>
              {group.note ? (
                <p className="mt-2 text-[0.875rem] leading-relaxed text-steel-600">{p(group.note)}</p>
              ) : null}
              <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.13em] text-steel-500 tabular-nums">
                {p("{n} families", { n: families.length })}
              </p>
            </Reveal>

            <ul className="grid grid-rule sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
              {families.map((family, i) => (
                <Reveal as="li" key={family.slug} delay={i * 70} className="bg-white">
                  <FamilyCard family={family} index={start + i} priority={priority && start + i < 3} />
                </Reveal>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
