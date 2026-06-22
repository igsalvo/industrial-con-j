import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEpisodes, getAllGuests, getAllSponsors, getSiteConfig } from "@/lib/queries";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { GuestCard } from "@/components/ui/guest-card";
import { SponsorShowcase } from "@/components/sections/sponsor-showcase";
import { SectionHeading } from "@/components/sections/section-heading";
import { ExternalLink, Star } from "lucide-react";

const tabs = [
  { id: "episodes", label: "Episodios" },
  { id: "guests", label: "Invitados" },
  { id: "sponsors", label: "Aliados" }
] as const;

function isFeaturedGuest(guest: { socialLinks: unknown }) {
  const links = (guest.socialLinks ?? {}) as Record<string, unknown>;
  return links.isFeatured === true || links.isFeatured === "true" || links.isFeatured === "on" || links.isFeatured === "1";
}

export default async function PodcastPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const activeTab = tabs.some((tab) => tab.id === params.tab) ? params.tab : "episodes";
  const [episodes, guests, sponsors, siteConfig] = await Promise.all([getAllEpisodes(), getAllGuests(), getAllSponsors(), getSiteConfig()]);
  if (!siteConfig.showPodcastSection) {
    notFound();
  }
  const headings = {
    episodes: {
      eyebrow: siteConfig.episodesPageEyebrow || "Archivo",
      title: siteConfig.episodesPageTitle || "Todos los episodios",
      description:
        siteConfig.episodesPageDescription ||
        "Explora el catálogo completo con lecturas limpias, links externos y relación entre invitados, tags e industrias."
    },
    guests: {
      eyebrow: siteConfig.guestsPageEyebrow || "Invitados",
      title: siteConfig.guestsPageTitle || "Personas que construyen industria",
      description: siteConfig.guestsPageDescription || "Perfiles, empresas, enlaces sociales y episodios donde participan."
    },
    sponsors: {
      eyebrow: siteConfig.sponsorsPageEyebrow || "ALIADOS",
      title: siteConfig.sponsorsPageTitle || "Aliados de Industrial con J",
      description: siteConfig.sponsorsPageDescription || "Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial."
    }
  } as const;
  const heading = headings[activeTab as keyof typeof headings];
  const featuredGuests = guests.filter(isFeaturedGuest);
  const regularGuests = guests.filter((guest) => !featuredGuests.some((featured) => featured.id === guest.id));

  return (
    <main className="shell space-y-8 py-10">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
      />

      <nav className="flex flex-wrap gap-2 rounded-2xl border border-[color:var(--line)] p-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/podcast?tab=${tab.id}`}
            className={activeTab === tab.id ? "btn-primary !px-4 !py-2 text-sm" : "btn-secondary !px-4 !py-2 text-sm"}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "episodes" ? (
        <section className="space-y-6">
          {episodes.length === 0 ? (
            <p className="card p-6 text-sm text-[color:var(--muted)]">Aún no hay episodios publicados.</p>
          ) : (
            <div className="space-y-8">
              {episodes.map((episode) => {
                const embedUrl = episode.videoEmbedUrl || getYouTubeEmbedUrl(episode.youtubeUrl);
                const platformLinks = [
                  { label: "Spotify", href: episode.spotifyUrl, eventName: "click_spotify" },
                  { label: "YouTube", href: episode.youtubeUrl, eventName: "click_youtube" },
                  { label: "Apple Podcasts", href: episode.applePodcastsUrl, eventName: "click_apple_podcasts" }
                ].filter((platform): platform is { label: string; href: string; eventName: string } => Boolean(platform.href));

                return (
                  <article key={episode.id} className="card overflow-hidden">
                    <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-black">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={episode.title}
                          className="aspect-video w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex aspect-video items-center justify-center p-6 text-sm text-white/70">Sin video embebido</div>
                      )}
                    </div>
                    <div className="p-6 md:p-8">
                      <p className="whitespace-pre-line leading-7 text-[color:var(--muted)]">{episode.shortDescription}</p>
                      {platformLinks.length ? (
                        <div className="mt-6 flex flex-wrap gap-3">
                          {platformLinks.map((platform) => (
                            <TrackedAnchor
                              key={platform.label}
                              href={platform.href}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-secondary gap-2 !px-4 !py-2 text-sm"
                              eventName={platform.eventName}
                              eventParams={{
                                link_text: platform.label,
                                content_type: "episode",
                                content_title: episode.title,
                                section: "podcast_episode"
                              }}
                            >
                              {platform.label}
                              <ExternalLink size={14} />
                            </TrackedAnchor>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "guests" ? (
        <section className="space-y-6">
          {featuredGuests.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {featuredGuests.map((guest) => (
                <div key={guest.slug} className="relative rounded-[1.75rem] border border-[color:var(--accent)]/60 bg-[radial-gradient(circle_at_18%_0%,rgba(226,33,28,0.14),transparent_32%),rgba(255,255,255,0.04)] p-1 shadow-[0_0_36px_rgba(226,33,28,0.13)] [&_.card]:grid [&_.card]:overflow-hidden [&_.card]:md:grid-cols-[0.9fr_1fr] [&_.card>div:first-child]:h-[260px] [&_.card>div:first-child]:border-b-0 [&_.guest-card-image]:object-contain">
                  <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/60 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--accent)] backdrop-blur">
                    <Star size={12} />Destacado
                  </span>
                  <GuestCard guest={guest} />
                </div>
              ))}
            </div>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {regularGuests.map((guest) => (
              <GuestCard key={guest.slug} guest={guest} />
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "sponsors" ? <SponsorShowcase sponsors={sponsors} /> : null}
    </main>
  );
}
