import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EpisodeForm } from "@/components/admin/episode-form";

export default async function EditEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [episode, guests, sponsors] = await Promise.all([
    prisma.episode.findUnique({
      where: { id },
      include: { guests: { select: { id: true } } }
    }),
    prisma.guest.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.sponsor.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
  ]);

  if (!episode) {
    notFound();
  }

  return (
    <div className="card p-8">
      <h2 className="text-3xl font-black">Editar episodio</h2>
      <div className="mt-6">
        <EpisodeForm mode="edit" episode={episode} guests={guests} sponsors={sponsors} />
      </div>
    </div>
  );
}
