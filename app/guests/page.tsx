import { prisma } from "@/lib/prisma";
import { GuestCard } from "@/components/ui/guest-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/sections/section-heading";

export default async function GuestsPage() {
  const guests = await prisma.guest.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <section className="shell py-12">
      <SectionHeading
        eyebrow="Invitados"
        title="Personas que construyen industria"
        description="Perfiles, empresas, enlaces sociales y episodios donde participan."
      />
      {guests.length === 0 ? (
        <EmptyState title="Todavia no hay invitados" description="Agrega invitados desde el panel admin para poblar esta seccion." />
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
