import Link from "next/link";
import { notFound } from "next/navigation";
import { getEpisodeBySlug, getRelatedEpisodes } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { EpisodeCard } from "@/components/ui/episode-card";
import { PublicSurveyForm } from "@/components/forms/public-survey-form";

type ResourceLink = {
  label: string;
  url: string;
};

export default async function EpisodeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  const relatedEpisodes = await getRelatedEpisodes(episode.tags, episode.id);
  const resourceLinks = Array.isArray(episode.resourceLinks) ? (episode.resourceLinks as ResourceLink[]) : [];

  return (
    <section className="shell py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-8">
          <div className="card overflow-hidden">
            <div
              className="h-72 bg-cover bg-center"
              style={{
                backgroundImage: episode.clipThumbnailUrl
                  ? `url(${episode.clipThumbnailUrl})`
                  : "linear-gradient(135deg, #0f766e, #0f172a)"
              }}
            />
            <div className="p-8">
              <div className="flex flex-wrap gap-2">
                {episode.tags.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-5 text-4xl font-black">{episode.title}</h1>
              <p className="mt-4 text-sm text-[color:var(--muted)]">{episode.shortDescription}</p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-[color:var(--muted)]">
                <p>{formatDate(episode.publishedAt)}</p>
                <p>{episode.guests.map((guest) => guest.name).join(", ") || "Sin invitados asociados"}</p>
                <p>{episode.sponsor ? `Sponsor: ${episode.sponsor.name}` : "Sin sponsor"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {episode.videoEmbedUrl ? (
              <div className="card overflow-hidden">
                <iframe className="h-72 w-full" src={episode.videoEmbedUrl} title={episode.title} allowFullScreen />
              </div>
            ) : null}
            {episode.audioEmbedUrl ? (
              <div className="card overflow-hidden">
                <iframe className="h-72 w-full" src={episode.audioEmbedUrl} title={`${episode.title} audio`} />
              </div>
            ) : null}
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold">Descripcion</h2>
            <p className="mt-4 whitespace-pre-line leading-7 text-[color:var(--muted)]">{episode.longDescription}</p>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold">Timestamps</h2>
            <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              {episode.timestamps.map((timestamp) => (
                <li key={timestamp}>{timestamp}</li>
              ))}
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold">Links externos</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {episode.spotifyUrl ? (
                <a className="btn-primary" href={episode.spotifyUrl} target="_blank" rel="noreferrer">
                  Spotify
                </a>
              ) : null}
              {episode.youtubeUrl ? (
                <a className="btn-secondary" href={episode.youtubeUrl} target="_blank" rel="noreferrer">
                  YouTube
                </a>
              ) : null}
              {episode.applePodcastsUrl ? (
                <a className="btn-secondary" href={episode.applePodcastsUrl} target="_blank" rel="noreferrer">
                  Apple Podcasts
                </a>
              ) : null}
            </div>
          </div>

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
                episode.guests.map((guest) => (
                  <div key={guest.id} className="rounded-2xl border border-[color:var(--line)] p-4">
                    <p className="font-semibold">{guest.name}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{guest.company || "Invitado del podcast"}</p>
                    <Link href={`/guests/${guest.slug}`} className="mt-3 inline-block text-sm font-semibold text-[color:var(--accent)]">
                      Ver perfil
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[color:var(--muted)]">Este episodio todavia no tiene invitados asociados.</p>
              )}
            </div>
          </div>

          {episode.surveys[0] ? <PublicSurveyForm survey={episode.surveys[0]} /> : null}
        </aside>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-black">Episodios relacionados</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {relatedEpisodes.map((item) => (
            <EpisodeCard key={item.id} episode={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
