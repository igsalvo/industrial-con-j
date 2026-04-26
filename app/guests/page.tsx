import { getAllGuests } from "@/lib/queries";
import { GuestCard } from "@/components/ui/guest-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/sections/section-heading";

export default async function GuestsPage() {
  const guests = await getAllGuests();

  return (
    <section className="shell py-12">
      <SectionHeading
        eyebrow="Invitados"
        title="Personas que construyen industria"
        description="Perfiles, empresas, enlaces sociales y episodios donde participan."
      />
      {guests.length === 0 ? (
        <EmptyState title="Todavia no hay invitados" description="El MVP parte con perfiles curados y despues puede crecer con mas fichas." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {guests.map((guest) => (
            <GuestCard key={guest.slug} guest={guest} />
          ))}
        </div>
      )}
    </section>
  );
}
