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
    guests: Array<{ id: string; name: string; slug: string }>;
    sponsor: { name: string } | null;
  };
};

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const imageUrl = episode.thumbnailUrl || episode.clipThumbnailUrl || episodePlaceholder;
  const imagePosition = `${episode.thumbnailPositionX || "center"} ${episode.thumbnailPositionY || "center"}`;

  return (
    <article className="card overflow-hidden">
      <TrackedLink
        href={`/episodes/${episode.slug}`}
        className="relative block h-56 overflow-hidden border-b border-[color:var(--line)] bg-[linear-gradient(135deg,#d70904,#2b2b2b)] md:h-64"
        eventName="click_episode"
        eventParams={{
          link_text: episode.title,
          content_type: "episode",
          content_title: episode.title,
          section: "episode_card_thumbnail"
        }}
      >
        <Image src={imageUrl} alt={episode.title} fill className="object-cover transition duration-300 hover:scale-[1.03]" style={{ objectPosition: imagePosition }} sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5">
          <p className="line-clamp-2 text-2xl font-black leading-tight text-white">{episode.title}</p>
        </div>
      </TrackedLink>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {episode.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-[color:var(--muted)]">{episode.shortDescription}</p>
        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
          <div>
            <p>{formatDate(episode.publishedAt)}</p>
            <p>
              {episode.guests.length
                ? episode.guests.map((guest, index) => (
                    <span key={guest.id}>
                      {index > 0 ? ", " : null}
                      <TrackedLink href={`/guests/${guest.slug}`} eventName="click_guest" eventParams={{ link_text: guest.name, content_type: "guest", content_title: guest.name, section: "episode_card" }} className="hover:text-[color:var(--accent)] hover:underline">
                        {guest.name}
                      </TrackedLink>
                    </span>
                  ))
                : "Sin invitado"}
            </p>
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
