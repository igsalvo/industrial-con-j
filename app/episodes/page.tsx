import { getAllEpisodes, getSiteConfig } from "@/lib/queries";
import { EpisodeCard } from "@/components/ui/episode-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/sections/section-heading";
import { notFound } from "next/navigation";

export default async function EpisodesPage() {
  const [episodes, config] = await Promise.all([getAllEpisodes(), getSiteConfig()]);
  if (!config.showPodcastSection) {
    notFound();
  }

  return (
    <section className="shell py-12">
      <SectionHeading
        eyebrow={config.episodesPageEyebrow || "Archivo"}
        title={config.episodesPageTitle || "Todos los episodios"}
        description={config.episodesPageDescription || "Explora el catálogo completo con lecturas limpias, links externos y relación entre invitados, tags e industrias."}
      />
      {episodes.length === 0 ? (
        <EmptyState title="Aún no hay episodios publicados" description="Este MVP parte con contenido editorial estático y puede ampliarse después." />
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
