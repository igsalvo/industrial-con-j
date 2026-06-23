import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Music2, Youtube } from "lucide-react";
import { getEpisodeBySlug, getRelatedEpisodes, getSiteConfig } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { PublicSurveyForm } from "@/components/forms/public-survey-form";
import { EpisodeCard } from "@/components/ui/episode-card";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/tracked-link";

type ResourceLink = {
  label: string;
  url: string;
};

export default async function EpisodeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [episode, siteConfig] = await Promise.all([getEpisodeBySlug(slug), getSiteConfig()]);

  if (!episode || !siteConfig.showPodcastSection) {
    notFound();
  }

  const relatedEpisodes = await getRelatedEpisodes(episode.tags, episode.id);
  const resourceLinks = Array.isArray(episode.resourceLinks) ? (episode.resourceLinks as ResourceLink[]) : [];
  const thumbnailUrl = episode.thumbnailUrl || episode.clipThumbnailUrl || "/logo-podcast.jpg";
  const thumbnailPosition = `${episode.thumbnailPositionX || "center"} ${episode.thumbnailPositionY || "center"}`;
  const platformLinks = [
    episode.spotifyUrl
      ? {
          href: episode.spotifyUrl,
          label: "Spotify",
          eventName: "click_spotify",
          icon: Music2,
          className: "btn-primary"
        }
      : null,
    episode.youtubeUrl
      ? {
          href: episode.youtubeUrl,
          label: "YouTube",
          eventName: "click_youtube",
          icon: Youtube,
          className: "btn-secondary"
        }
      : null,
    episode.applePodcastsUrl
      ? {
          href: episode.applePodcastsUrl,
          label: "Apple Podcasts",
          eventName: "click_apple_podcasts",
          icon: Music2,
          className: "btn-secondary"
        }
      : null
  ].filter(Boolean);

  return (
    <section className="shell py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-8">
          <div className="card overflow-hidden">
            <div className="relative h-72 bg-[color:var(--surface-strong)] sm:h-[420px]">
              <Image
                src={thumbnailUrl}
                alt={episode.title}
                fill
                className="object-cover"
                style={{ objectPosition: thumbnailPosition }}
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/65 to-transparent" />
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-2">
                {episode.tags.map((tag: string) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-5 text-4xl font-black">{episode.title}</h1>
              <p className="mt-4 text-sm text-[color:var(--muted)]">{episode.shortDescription}</p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-[color:var(--muted)]">
                <p>{formatDate(episode.publishedAt)}</p>
                <p>
                  {episode.guests.length
                    ? episode.guests.map((guest: (typeof episode.guests)[number], index: number) => (
                        <span key={guest.id}>
                          {index > 0 ? ", " : null}
                          <Link className="hover:text-[color:var(--accent)] hover:underline" href={`/guests/${guest.slug}`}>{guest.name}</Link>
                        </span>
                      ))
                    : "Sin invitados asociados"}
                </p>
                <p>{episode.sponsor ? `Aliado: ${episode.sponsor.name}` : "Sin aliado"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {episode.videoEmbedUrl ? (
              <div className="card overflow-hidden">
                <iframe className="aspect-video w-full" src={episode.videoEmbedUrl} title={episode.title} allowFullScreen />
              </div>
            ) : null}
            {episode.audioEmbedUrl ? (
              <div className="card overflow-hidden">
                <iframe className="h-80 w-full" src={episode.audioEmbedUrl} title={`${episode.title} audio`} />
              </div>
            ) : null}
            {platformLinks.length > 0 ? (
              <div className="card p-6">
                <h2 className="text-2xl font-bold">Escuchar o ver el episodio</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {platformLinks.map((platform) => {
                    if (!platform) return null;
                    const Icon = platform.icon;

                    return (
                      <TrackedAnchor
                        key={platform.label}
                        className={`${platform.className} gap-2`}
                        href={platform.href}
                        target="_blank"
                        rel="noreferrer"
                        eventName={platform.eventName}
                        eventParams={{
                          link_text: platform.label,
                          content_type: "episode",
                          content_title: episode.title,
                          section: "episode_external_links"
                        }}
                      >
                        <Icon size={18} />
                        {platform.label}
                      </TrackedAnchor>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {episode.longDescription ? (
            <div className="card p-8">
              <h2 className="text-2xl font-bold">Descripción</h2>
              <p className="mt-4 whitespace-pre-line leading-7 text-[color:var(--muted)]">{episode.longDescription}</p>
            </div>
          ) : null}

          {episode.timestamps.length > 0 ? (
            <div className="card p-8">
              <h2 className="text-2xl font-bold">Timestamps</h2>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
                {episode.timestamps.map((timestamp: string) => (
                  <li key={timestamp}>{timestamp}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {resourceLinks.length > 0 ? (
            <div className="card p-8">
              <h2 className="text-2xl font-bold">Recursos descargables</h2>
              <div className="mt-4 space-y-3">
                {resourceLinks.map((resource) => (
                  <a
                    key={`${resource.label}-${resource.url}`}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-[color:var(--line)] p-4 text-sm"
                  >
                    {resource.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <aside className="space-y-6">
          <div className="card p-8">
            <h2 className="text-2xl font-bold">Invitados</h2>
            <div className="mt-4 space-y-4">
              {episode.guests.length ? (
                episode.guests.map((guest: (typeof episode.guests)[number]) => (
                  <div key={guest.slug} className="grid grid-cols-[72px_1fr] gap-4 rounded-2xl border border-[color:var(--line)] p-4">
                    <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#d70904,#2b2b2b)]">
                      {guest.profileImage ? (
                        <Image
                          src={guest.profileImage}
                          alt={guest.name}
                          fill
                          className="object-cover"
                          style={{ objectPosition: `${guest.profilePositionX || "center"} ${guest.profilePositionY || "center"}` }}
                          sizes="72px"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-semibold">{guest.name}</p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">{guest.company || "Invitado del podcast"}</p>
                      <TrackedLink
                        href={`/guests/${guest.slug}`}
                        className="mt-3 inline-block text-sm font-semibold text-[color:var(--accent)]"
                        eventName="click_episode"
                        eventParams={{
                          link_text: "Ver perfil",
                          content_type: "episode",
                          content_title: episode.title,
                          section: "episode_guest_profile"
                        }}
                      >
                        Ver perfil
                      </TrackedLink>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[color:var(--muted)]">Este episodio todavía no tiene invitados asociados.</p>
              )}
            </div>
          </div>

          {episode.surveys.length > 0 ? (
            <div className="space-y-4">
              {episode.surveys.map((survey: (typeof episode.surveys)[number]) => (
                <PublicSurveyForm key={survey.id} survey={survey} />
              ))}
            </div>
          ) : null}
        </aside>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-black">Episodios relacionados</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {relatedEpisodes.map((item: (typeof relatedEpisodes)[number]) => (
            <EpisodeCard key={item.slug} episode={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
