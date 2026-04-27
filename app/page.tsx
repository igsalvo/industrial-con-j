import Link from "next/link";
import { getHomepageData } from "@/lib/queries";
import { HeroSection } from "@/components/sections/hero-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { EpisodeCard } from "@/components/ui/episode-card";
import { GuestCard } from "@/components/ui/guest-card";
import { SponsorGrid } from "@/components/ui/sponsor-grid";
import { SponsorBanner } from "@/components/ui/sponsor-banner";
import { getSiteConfig } from "@/lib/queries";

export default async function HomePage() {
  const { featuredClips, latestEpisodes, recommendedEpisodes, sponsors, guests } = await getHomepageData();
  const siteConfig = await getSiteConfig();

  return (
    <div className="pb-16">
      <HeroSection />

      {siteConfig.showSponsorBanner ? (
        <SponsorBanner
          title={siteConfig.sponsorBannerTitle || "Auspiciadores"}
          sponsors={sponsors.filter((sponsor: (typeof sponsors)[number]) => sponsor.logoUrl)}
        />
      ) : null}

      {siteConfig.showFeaturedClips ? (
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
      ) : null}

      {siteConfig.showLatestEpisodes ? (
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
      ) : null}

      {siteConfig.showSponsorsSection ? (
        <section className="shell py-8">
          <SectionHeading
            eyebrow="Sponsors"
            title="Marcas alineadas con la industria"
            description="Espacio para patrocinadores destacados y oportunidades de partnership por episodio."
          />
          <SponsorGrid sponsors={sponsors} />
        </section>
      ) : null}

      {siteConfig.showRecommendedSection ? (
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
      ) : null}

      {siteConfig.showGuestsSection ? (
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
      ) : null}
    </div>
  );
}
