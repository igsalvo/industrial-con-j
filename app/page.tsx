import Link from "next/link";
import { getHomepageData } from "@/lib/queries";
import { HeroSection } from "@/components/sections/hero-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { EpisodeCard } from "@/components/ui/episode-card";
import { GuestCard } from "@/components/ui/guest-card";
import { SponsorGrid } from "@/components/ui/sponsor-grid";

export default async function HomePage() {
  const { featuredClips, latestEpisodes, recommendedEpisodes, sponsors, guests } = await getHomepageData();

  return (
    <div className="pb-16">
      <HeroSection />

      <section className="shell py-8">
        <SectionHeading
          eyebrow="Clips destacados"
          title="Microcontenido para crecer audiencia"
          description="Usa clips cortos como puerta de entrada a episodios completos y contenido descargable."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredClips.map((episode: (typeof featuredClips)[number]) => (
            <EpisodeCard key={episode.slug} episode={episode} />
          ))}
        </div>
      </section>

      <section className="shell py-8">
        <SectionHeading
          eyebrow="Ultimos episodios"
          title="Conversaciones aplicadas a operaciones"
          description="Desde mejora continua hasta transformacion digital, con invitados del mundo industrial."
        />
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {latestEpisodes.map((episode: (typeof latestEpisodes)[number]) => (
            <EpisodeCard key={episode.slug} episode={episode} />
          ))}
        </div>
      </section>

      <section className="shell py-8">
        <SectionHeading
          eyebrow="Sponsors"
          title="Marcas alineadas con la industria"
          description="Espacio para patrocinadores destacados y oportunidades de partnership por episodio."
        />
        <SponsorGrid sponsors={sponsors} />
      </section>

      <section className="shell py-8">
        <SectionHeading
          eyebrow="Recomendados"
          title="Episodios que merecen otra escucha"
          description="Selecciones editoriales para facilitar descubrimiento y aumentar tiempo de sesion."
        />
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {recommendedEpisodes.map((episode: (typeof recommendedEpisodes)[number]) => (
            <EpisodeCard key={episode.slug} episode={episode} />
          ))}
        </div>
      </section>

      <section className="shell py-8">
        <SectionHeading
          eyebrow="Invitados"
          title="Voces del ecosistema industrial"
          description="Expertos, operadores y lideres que aterrizan teoria en ejecucion."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {guests.map((guest: (typeof guests)[number]) => (
            <GuestCard key={guest.slug} guest={guest} />
          ))}
        </div>
      </section>

      <section className="shell py-8">
        <div className="card flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <p className="pill">Growth CTA</p>
            <h2 className="mt-4 text-3xl font-black">Convierte audiencia casual en comunidad recurrente</h2>
            <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted)]">
              Lleva trafico desde clips hacia Spotify, YouTube, Apple Podcasts y los canales sociales del proyecto.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="btn-primary" href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a className="btn-secondary" href="https://open.spotify.com" target="_blank" rel="noreferrer">
              Spotify
            </a>
            <Link className="btn-secondary" href="/community">
              Encuestas y concursos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
