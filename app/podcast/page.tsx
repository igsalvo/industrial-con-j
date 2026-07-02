import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllEpisodes, getAllGuests, getAllSponsors, getSiteConfig } from "@/lib/queries";
import { getGuestImagePosition } from "@/lib/guest-image-position";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/tracked-link";
import { GuestCard } from "@/components/ui/guest-card";
import { SponsorShowcase } from "@/components/sections/sponsor-showcase";
import { SectionHeading } from "@/components/sections/section-heading";
import { ExternalLink, Play, Star } from "lucide-react";

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

      <nav className="flex flex-wrap gap-2 rounded-2xl border border-[color:var(--line)] p-2" aria-label="Secciones del podcast">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/podcast?tab=${tab.id}`}
            className={activeTab === tab.id ? "btn-primary flex-1 !px-4 !py-2 text-sm sm:flex-none" : "btn-secondary flex-1 !px-4 !py-2 text-sm sm:flex-none"}
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
                const thumbnailUrl = episode.thumbnailUrl || episode.clipThumbnailUrl || "/logo-podcast.jpg";
                const imagePosition = `${episode.thumbnailPositionX || "center"} ${episode.thumbnailPositionY || "center"}`;
                const platformLinks = [
                  { label: "Spotify", href: episode.spotifyUrl, eventName: "click_spotify" },
                  { label: "YouTube", href: episode.youtubeUrl, eventName: "click_youtube" },
                  { label: "Apple Podcasts", href: episode.applePodcastsUrl, eventName: "click_apple_podcasts" }
                ].filter((platform): platform is { label: string; href: string; eventName: string } => Boolean(platform.href));

                return (
                  <article key={episode.id} className="card grid overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
                    <TrackedLink
                      href={`/episodes/${episode.slug}`}
                      className="group relative block aspect-video overflow-hidden bg-[linear-gradient(135deg,#d70904,#2b2b2b)] lg:aspect-auto lg:min-h-[360px]"
                      eventName="click_episode"
                      eventParams={{
                        link_text: "Play",
                        content_type: "episode",
                        content_title: episode.title,
                        section: "podcast_episode_thumbnail"
                      }}
                    >
                      <Image
                        src={thumbnailUrl}
                        alt={episode.title}
                        fill
                        className="object-contain transition duration-300"
                        style={{ objectPosition: imagePosition }}
                        sizes="(min-width: 1024px) 42vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-full bg-[color:var(--accent)] text-white shadow-[0_0_36px_rgba(226,33,28,0.42)] transition group-hover:scale-105 sm:bottom-6 sm:left-6 sm:h-16 sm:w-16">
                        <Play size={26} fill="currentColor" />
                      </div>
                    </TrackedLink>
                    <div className="flex flex-col justify-between p-5 md:p-8">
                      <div>
                        <h2 className="text-[clamp(1.65rem,7vw,2rem)] font-black">
                          <Link href={`/episodes/${episode.slug}`} className="hover:text-[color:var(--accent)]">{episode.title}</Link>
                        </h2>
                        <p className="mt-4 line-clamp-3 leading-7 text-[color:var(--muted)]">{episode.shortDescription}</p>
                      </div>
                      {episode.guests.length ? (
                        <div className="mt-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">Invitados</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {episode.guests.map((guest) => (
                              <Link
                                key={guest.id}
                                href={`/guests/${guest.slug}`}
                                className="rounded-full border border-[color:var(--line)] px-3 py-1.5 text-sm font-semibold hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                              >
                                {guest.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {platformLinks.length ? (
                        <div className="mt-7">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">Dónde verlo o escucharlo</p>
                          <div className="mt-3 grid gap-3 sm:flex sm:flex-wrap">
                            {platformLinks.map((platform) => (
                              <TrackedAnchor
                                key={platform.label}
                                href={platform.href}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-secondary w-full gap-2 !px-4 !py-2 text-sm sm:w-auto"
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
                            <TrackedLink
                              href={`/episodes/${episode.slug}`}
                              className="btn-primary w-full gap-2 !px-4 !py-2 text-sm sm:w-auto"
                              eventName="click_episode"
                              eventParams={{
                                link_text: "Ver episodio",
                                content_type: "episode",
                                content_title: episode.title,
                                section: "podcast_episode"
                              }}
                            >
                              <Play size={15} fill="currentColor" />
                              Ver episodio
                            </TrackedLink>
                          </div>
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
              {featuredGuests.map((guest) => {
                const imagePosition = getGuestImagePosition(guest);
                const latestEpisode = guest.episodes?.[0];

                return (
                  <article
                    key={guest.slug}
                    className="grid min-w-0 overflow-hidden rounded-[1.75rem] border border-[color:var(--accent)]/60 bg-[radial-gradient(circle_at_18%_0%,rgba(226,33,28,0.14),transparent_32%),rgba(255,255,255,0.04)] p-1 shadow-[0_0_36px_rgba(226,33,28,0.13)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]"
                  >
                    <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-[1.45rem] bg-[#242424] lg:aspect-auto lg:min-h-[260px]">
                      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/60 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--accent)] backdrop-blur">
                        <Star size={12} />Destacado
                      </span>
                      {guest.profileImage ? (
                        <Image
                          src={guest.profileImage}
                          alt={guest.name}
                          fill
                          className="object-cover"
                          style={{ objectPosition: imagePosition }}
                          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 45vw, 100vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-col p-5 sm:p-6">
                      <h3 className="text-2xl font-black leading-tight">
                        <Link href={`/guests/${guest.slug}`} className="hover:text-[color:var(--accent)]">
                          {guest.name}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm text-[color:var(--muted)]">{guest.company || "Invitado del podcast"}</p>
                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[color:var(--muted)]">{guest.bio}</p>
                      {latestEpisode ? (
                        <Link href={`/episodes/${latestEpisode.slug}`} className="btn-secondary mt-auto !px-4 !py-2 text-sm" aria-label={`Ver episodio ${latestEpisode.title}`}>
                          Ver episodio
                        </Link>
                      ) : (
                        <Link href={`/guests/${guest.slug}`} className="btn-secondary mt-auto !px-4 !py-2 text-sm">
                          Ver perfil
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
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
