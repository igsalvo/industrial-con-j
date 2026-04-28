import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

type EpisodeCardProps = {
  episode: {
    id?: string;
    slug: string;
    title: string;
    shortDescription: string;
    tags: string[];
    publishedAt: Date;
    clipThumbnailUrl: string | null;
    guests: Array<{ id: string; name: string }>;
    sponsor: { name: string } | null;
  };
};

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <article className="card overflow-hidden">
      <div className="relative h-56 overflow-hidden border-b border-[color:var(--line)] bg-[linear-gradient(135deg,#d70904,#2b2b2b)] md:h-64">
        {episode.clipThumbnailUrl ? (
          <img src={episode.clipThumbnailUrl} alt={episode.title} className="h-full w-full object-cover" />
        ) : null}
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
          <Link href={`/episodes/${episode.slug}`}>{episode.title}</Link>
        </h3>
        <p className="mt-3 text-sm text-[color:var(--muted)]">{episode.shortDescription}</p>
        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
          <div>
            <p>{formatDate(episode.publishedAt)}</p>
            <p>{episode.guests.map((guest: (typeof episode.guests)[number]) => guest.name).join(", ") || "Sin invitado"}</p>
          </div>
          <Link href={`/episodes/${episode.slug}`} className="btn-secondary gap-2 !px-4 !py-2 text-xs">
            Ver episodio
            <ExternalLink size={14} />
          </Link>
        </div>
        {episode.sponsor ? <p className="mt-3 text-xs text-[color:var(--muted)]">Sponsor: {episode.sponsor.name}</p> : null}
      </div>
    </article>
  );
}
