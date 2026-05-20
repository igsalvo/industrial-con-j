import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TrackedLink } from "@/components/analytics/tracked-link";

const episodePlaceholder = "/logo-podcast.jpg";

type EpisodeCardProps = {
  episode: {
    id?: string;
    slug: string;
    title: string;
    shortDescription: string;
    tags: string[];
    publishedAt: Date;
    thumbnailUrl?: string | null;
    thumbnailPositionX?: string | null;
    thumbnailPositionY?: string | null;
    clipThumbnailUrl: string | null;
    guests: Array<{ id: string; name: string }>;
    sponsor: { name: string } | null;
  };
};

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const imageUrl = episode.thumbnailUrl || episode.clipThumbnailUrl || episodePlaceholder;
  const imagePosition = `${episode.thumbnailPositionX || "center"} ${episode.thumbnailPositionY || "center"}`;

  return (
    <article className="card overflow-hidden">
      <div className="relative h-56 overflow-hidden border-b border-[color:var(--line)] bg-[linear-gradient(135deg,#d70904,#2b2b2b)] md:h-64">
        <Image src={imageUrl} alt={episode.title} fill className="object-cover" style={{ objectPosition: imagePosition }} sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {episode.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
          <TrackedLink
            href={`/episodes/${episode.slug}`}
            eventName="click_episode"
            eventParams={{
              link_text: episode.title,
              content_type: "episode",
              content_title: episode.title,
              section: "episode_card"
            }}
          >
            {episode.title}
          </TrackedLink>
        </h3>
        <p className="mt-3 text-sm text-[color:var(--muted)]">{episode.shortDescription}</p>
        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
          <div>
            <p>{formatDate(episode.publishedAt)}</p>
            <p>{episode.guests.map((guest: (typeof episode.guests)[number]) => guest.name).join(", ") || "Sin invitado"}</p>
          </div>
          <TrackedLink
            href={`/episodes/${episode.slug}`}
            className="btn-secondary gap-2 !px-4 !py-2 text-xs"
            eventName="click_episode"
            eventParams={{
              link_text: "Ver episodio",
              content_type: "episode",
              content_title: episode.title,
              section: "episode_card"
            }}
          >
            Ver episodio
            <ExternalLink size={14} />
          </TrackedLink>
        </div>
        {episode.sponsor ? <p className="mt-3 text-xs text-[color:var(--muted)]">Aliado: {episode.sponsor.name}</p> : null}
      </div>
    </article>
  );
}
