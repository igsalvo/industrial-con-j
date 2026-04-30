import Link from "next/link";
import { getHomepageData, getSiteConfig } from "@/lib/queries";
import { ContactForm } from "@/components/forms/contact-form";
import { HeroSection } from "@/components/sections/hero-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { EpisodeCard } from "@/components/ui/episode-card";
import { GuestCard } from "@/components/ui/guest-card";
import { SponsorGrid } from "@/components/ui/sponsor-grid";
import { ShortClipCard } from "@/components/ui/short-clip-card";

export default async function HomePage() {
  const [{ featuredClips, latestEpisodes, sponsors, guests }, siteConfig] = await Promise.all([
    getHomepageData(),
    getSiteConfig()
  ]);

  const sections = [
    siteConfig.showFeaturedClips
      ? {
          key: "featuredClips",
          order: siteConfig.featuredClipsOrder,
          node: (
            <section className="shell py-8">
              <SectionHeading
                eyebrow={siteConfig.featuredClipsEyebrow || "Clips destacados"}
                title={siteConfig.featuredClipsTitle || "Shorts de los capitulos"}
                description={siteConfig.featuredClipsDescription || "Fragmentos cortos para destacar ideas clave y llevar trafico al episodio completo."}
              />
              <div className="grid gap-6 lg:grid-cols-3">
                {featuredClips.map((episode: (typeof featuredClips)[number]) => (
                  <ShortClipCard key={episode.slug} episode={episode} />
                ))}
              </div>
            </section>
          )
        }
      : null,
    siteConfig.showLatestEpisodes
      ? {
          key: "latestEpisodes",
          order: siteConfig.latestEpisodesOrder,
          node: (
            <section className="shell py-8">
              <SectionHeading
                eyebrow={siteConfig.latestEpisodesEyebrow || "Ultimos episodios"}
                title={siteConfig.latestEpisodesTitle || "Conversaciones aplicadas a operaciones"}
                description={siteConfig.latestEpisodesDescription || "Desde mejora continua hasta transformacion digital, con invitados del mundo industrial."}
              />
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {latestEpisodes.map((episode: (typeof latestEpisodes)[number]) => (
                  <EpisodeCard key={episode.slug} episode={episode} />
                ))}
              </div>
            </section>
          )
        }
      : null,
    siteConfig.showSponsorsSection
      ? {
          key: "sponsors",
          order: siteConfig.sponsorsSectionOrder,
          node: (
            <section className="shell py-8">
              <SectionHeading
                eyebrow={siteConfig.sponsorsSectionEyebrow || "Sponsors"}
                title={siteConfig.sponsorsSectionTitle || "Marcas alineadas con la industria"}
                description={siteConfig.sponsorsSectionDescription || "Espacio para patrocinadores destacados y oportunidades de partnership por episodio."}
              />
              <SponsorGrid sponsors={sponsors} />
            </section>
          )
        }
      : null,
    siteConfig.showDonationsSection
      ? {
          key: "donations",
          order: siteConfig.donationsSectionOrder,
          node: (
            <section className="shell py-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <SectionHeading
                    eyebrow={siteConfig.donationsSectionEyebrow || "Donaciones"}
                    title={siteConfig.donationsSectionTitle || "Apoya nuevas conversaciones industriales"}
                    description={siteConfig.donationsSectionDescription || "Deja tus datos para coordinar una donacion, alianza o apoyo al proyecto."}
                  />
                  <div className="mt-6 flex flex-wrap gap-3">
                    {siteConfig.donationUrl ? (
                      <a className="btn-primary" href={siteConfig.donationUrl} target="_blank" rel="noreferrer">
                        Ir a donar
                      </a>
                    ) : null}
                    <Link className="btn-secondary" href="/donations">
                      Dejar contacto
                    </Link>
                  </div>
                </div>
                <ContactForm
                  type="DONATION"
                  title="Quiero apoyar el podcast"
                  description="Completa tus datos y quedaran disponibles para responder desde el administrador."
                  submitLabel="Enviar datos"
                />
              </div>
            </section>
          )
        }
      : null,
    siteConfig.showGuestsSection
      ? {
          key: "guests",
          order: siteConfig.guestsSectionOrder,
          node: (
            <section className="shell py-8">
              <SectionHeading
                eyebrow={siteConfig.guestsSectionEyebrow || "Invitados"}
                title={siteConfig.guestsSectionTitle || "Voces del ecosistema industrial"}
                description={siteConfig.guestsSectionDescription || "Expertos, operadores y lideres que aterrizan teoria en ejecucion."}
              />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {guests.map((guest: (typeof guests)[number]) => (
                  <GuestCard key={guest.slug} guest={guest} />
                ))}
              </div>
            </section>
          )
        }
      : null
  ]
    .filter((section): section is NonNullable<typeof section> => section !== null)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="pb-16">
      <HeroSection config={siteConfig} />

      {sections.map((section) => (
        <div key={section.key}>{section.node}</div>
      ))}
    </div>
  );
}
