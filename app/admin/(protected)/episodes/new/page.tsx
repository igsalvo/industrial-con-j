import { prisma } from "@/lib/prisma";
import { EpisodeForm } from "@/components/admin/episode-form";

export default async function NewEpisodePage() {
  const [guests, sponsors] = await Promise.all([
    prisma.guest.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.sponsor.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
  ]);

  return (
    <div className="card p-8">
      <h2 className="text-3xl font-black">Nuevo episodio</h2>
      <div className="mt-6">
        <EpisodeForm mode="create" guests={guests} sponsors={sponsors} />
      </div>
    </div>
  );
}
