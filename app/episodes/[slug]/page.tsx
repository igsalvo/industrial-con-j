import Image from "next/image";
import { notFound } from "next/navigation";
import { Music2, Youtube } from "lucide-react";
import { getEpisodeBySlug, getSiteConfig } from "@/lib/queries";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { PublicSurveyForm } from "@/components/forms/public-survey-form";
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

  const resourceLinks = Array.isArray(episode.resourceLinks) ? (episode.resourceLinks as ResourceLink[]) : [];
  const videoUrl = episode.videoEmbedUrl || getYouTubeEmbedUrl(episode.youtubeUrl);
  const platformLinks = [
    episode.spotifyUrl
      ? {
          href: episode.spotifyUrl,
          label: "Spotify",
          eventName: "click_spotify",
          icon: Music2
        }
      : null,
    episode.youtubeUrl
      ? {
          href: episode.youtubeUrl,
          label: "YouTube",
          eventName: "click_youtube",
          icon: Youtube
        }
      : null,
    episode.applePodcastsUrl
      ? {
          href: episode.applePodcastsUrl,
          label: "Apple Podcasts",
          eventName: "click_apple_podcasts",
          icon: Music2
        }
      : null
  ].filter(Boolean);

  return (
    <section className="shell py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-8">
          <div className="space-y-6">
            {videoUrl ? (
              <div className="card overflow-hidden bg-black">
                <iframe
                  className="aspect-video w-full"
                  src={videoUrl}
                  title={episode.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
            {episode.audioEmbedUrl ? (
              <div className="card overflow-hidden">
                <iframe className="h-64 w-full sm:h-80" src={episode.audioEmbedUrl} title={`${episode.title} audio`} />
              </div>
            ) : null}
          </div>

          {episode.timestamps.length > 0 ? (
            <div className="card p-5 sm:p-8">
              <h2 className="text-2xl font-bold">Timestamps</h2>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
                {episode.timestamps.map((timestamp: string) => (
                  <li key={timestamp}>{timestamp}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {resourceLinks.length > 0 ? (
            <div className="card p-5 sm:p-8">
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
          <div className="card p-5 sm:p-8">
            <h2 className="text-2xl font-bold">Invitados</h2>
            <div className="mt-4 space-y-4">
              {episode.guests.length ? (
                episode.guests.map((guest: (typeof episode.guests)[number]) => (
                  <div key={guest.slug} className="grid grid-cols-[64px_1fr] gap-4 rounded-2xl border border-[color:var(--line)] p-4 sm:grid-cols-[72px_1fr]">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#d70904,#2b2b2b)] sm:h-[72px] sm:w-[72px]">
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

        {episode.longDescription || platformLinks.length > 0 ? (
          <div className="card grid gap-6 p-6 lg:col-span-2 lg:grid-cols-[1fr_auto] lg:items-start lg:p-8">
            {episode.longDescription ? (
              <p className="whitespace-pre-line text-base leading-7 text-[color:var(--muted)]">{episode.longDescription}</p>
            ) : null}
            {platformLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3 lg:justify-end">
                {platformLinks.map((platform) => {
                  if (!platform) return null;
                  const Icon = platform.icon;

                  return (
                    <TrackedAnchor
                      key={platform.label}
                      className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white"
                      href={platform.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={platform.label}
                      title={platform.label}
                      eventName={platform.eventName}
                      eventParams={{
                        link_text: platform.label,
                        content_type: "episode",
                        content_title: episode.title,
                        section: "episode_external_links"
                      }}
                    >
                      <Icon size={22} />
                    </TrackedAnchor>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
