import { getAllEpisodes } from "@/lib/mvp-data";
import { EpisodeCard } from "@/components/ui/episode-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/sections/section-heading";

export default async function EpisodesPage() {
  const episodes = getAllEpisodes();

  return (
    <section className="shell py-12">
      <SectionHeading
        eyebrow="Archivo"
        title="Todos los episodios"
        description="Explora el catalogo completo con lecturas limpias, links externos y relacion entre invitados, tags e industrias."
      />
      {episodes.length === 0 ? (
        <EmptyState title="Aun no hay episodios publicados" description="Este MVP parte con contenido editorial estatico y puede ampliarse despues." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.slug} episode={episode} />
          ))}
        </div>
      )}
    </section>
  );
}
