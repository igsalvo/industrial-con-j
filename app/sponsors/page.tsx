import { getAllSponsors } from "@/lib/queries";
import { SectionHeading } from "@/components/sections/section-heading";
import { SponsorGrid } from "@/components/ui/sponsor-grid";
import { EmptyState } from "@/components/ui/empty-state";

export default async function SponsorsPage() {
  const sponsors = await getAllSponsors();

  return (
    <section className="shell py-12">
      <SectionHeading
        eyebrow="Sponsors"
        title="Aliados comerciales del podcast"
        description="Grid de logos, links de salida y sponsor destacado por episodio."
      />
      {sponsors.length === 0 ? (
        <EmptyState title="Aun no hay sponsors" description="El MVP deja este espacio listo para sumar aliados mas adelante." />
      ) : (
        <SponsorGrid sponsors={sponsors} />
      )}
    </section>
  );
}
