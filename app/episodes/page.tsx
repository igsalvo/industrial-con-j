import { prisma } from "@/lib/prisma";
import { EpisodeCard } from "@/components/ui/episode-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/sections/section-heading";

export default async function EpisodesPage() {
  const episodes = await prisma.episode.findMany({
    include: { guests: true, sponsor: true },
    orderBy: { publishedAt: "desc" }
  });

  return (
    <section className="shell py-12">
      <SectionHeading
        eyebrow="Archivo"
        title="Todos los episodios"
        description="Explora el catalogo completo con lecturas limpias, links externos y relacion entre invitados, tags e industrias."
      />
      {episodes.length === 0 ? (
        <EmptyState title="Aun no hay episodios publicados" description="El panel de administracion permite crear el primer episodio sin tocar codigo." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {episodes.map((episode: Awaited<ReturnType<typeof prisma.episode.findMany>>[number]) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      )}
    </section>
  );
}
