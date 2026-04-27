import Link from "next/link";
import { ExternalLink, PlayCircle } from "lucide-react";

function isDirectVideoUrl(url: string | null) {
  if (!url) {
    return false;
  }

  return [".mp4", ".webm", ".ogg", ".mov"].some((extension) => url.toLowerCase().includes(extension));
}

function getYouTubeEmbedUrl(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const id = parsedUrl.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      const id = parsedUrl.searchParams.get("v");

      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

      const shortsMatch = parsedUrl.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function ShortClipCard({
  episode
}: {
  episode: {
    slug: string;
    title: string;
    shortDescription: string;
    clipThumbnailUrl: string | null;
    clipVideoUrl?: string | null;
  };
}) {
  const canEmbedVideo = isDirectVideoUrl(episode.clipVideoUrl ?? null);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(episode.clipVideoUrl);

  return (
    <article className="card overflow-hidden">
      {youtubeEmbedUrl ? (
        <iframe
          className="h-64 w-full bg-black"
          src={youtubeEmbedUrl}
          title={`Short de ${episode.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : canEmbedVideo ? (
        <video
          className="h-64 w-full bg-black object-cover"
          controls
          muted
          playsInline
          preload="metadata"
          src={episode.clipVideoUrl || undefined}
        />
      ) : (
        <div
          className="relative h-64 bg-cover bg-center"
          style={{
            backgroundImage: episode.clipThumbnailUrl
              ? `url(${episode.clipThumbnailUrl})`
              : "linear-gradient(135deg, #d70904, #2b2b2b)"
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <PlayCircle size={52} className="text-white" />
          </div>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
          {episode.title}
        </h3>
        <p className="mt-3 text-sm text-[color:var(--muted)]">{episode.shortDescription}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {episode.clipVideoUrl ? (
            <a href={episode.clipVideoUrl} target="_blank" rel="noreferrer" className="btn-primary gap-2 !px-4 !py-2 text-sm">
              Ver short
              <ExternalLink size={14} />
            </a>
          ) : null}
          <Link href={`/episodes/${episode.slug}`} className="btn-secondary gap-2 !px-4 !py-2 text-sm">
            Ver episodio
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
