import Link from "next/link";
import { ArrowRight, CalendarDays, GraduationCap, Play, Podcast, Store, type LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

type AccessItem = {
  href: string;
  label: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  ariaLabel?: string;
  keepLabel?: boolean;
};

function isPlayableHeroVideoUrl(value: string) {
  if (value.startsWith("/")) {
    return /\.(mp4|webm|mov)(?:\?.*)?$/i.test(value);
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && /\.(mp4|webm|mov)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function getVideoMimeType(value: string) {
  const path = value.split("?")[0]?.toLowerCase() || "";
  if (path.endsWith(".webm")) return "video/webm";
  if (path.endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
}

export function HeroSection({
  config
}: {
  config: {
    heroEyebrow?: string | null;
    heroTitle?: string | null;
    heroTitleAccent?: string | null;
    heroDescription?: string | null;
    heroPrimaryCtaLabel?: string | null;
    heroPrimaryCtaHref?: string | null;
    heroSecondaryCtaLabel?: string | null;
    heroSecondaryCtaHref?: string | null;
    heroImageUrl?: string | null;
    heroVideoUrl?: string | null;
    heroVideoPosterUrl?: string | null;
    heroVideoEnabled?: boolean;
    showPodcastSection?: boolean;
    showEventsSection?: boolean;
    showHonorSection?: boolean;
    showProductsSection?: boolean;
  };
}) {
  const secondaryLabel = config.heroSecondaryCtaLabel || "Ver eventos";
  const secondaryHref = config.heroSecondaryCtaHref || "/events";
  const showVideo = Boolean(config.heroVideoEnabled);
  const configuredVideoUrl = config.heroVideoUrl?.trim();
  const youtubeEmbedUrl = getYouTubeEmbedUrl(configuredVideoUrl);
  const videoUrl = configuredVideoUrl && isPlayableHeroVideoUrl(configuredVideoUrl) ? configuredVideoUrl : null;
  const hasHeroMedia = showVideo && (youtubeEmbedUrl || videoUrl);
  const videoPosterUrl = config.heroVideoPosterUrl || config.heroImageUrl || undefined;
  const accessItems = ([
    config.showPodcastSection !== false
      ? {
          href: "/podcast",
          label: "Podcast",
          title: "Podcast",
          description: "Conversaciones con voces de la comunidad industrial.",
          Icon: Podcast
        }
      : null,
    config.showEventsSection !== false
      ? {
          href: "/events",
          label: "Eventos",
          title: "Eventos",
          description: "Encuentros y actividades para reunirnos.",
          Icon: CalendarDays,
          ariaLabel: "Ver eventos"
        }
      : null,
    config.showHonorSection !== false
      ? {
          href: "/honor",
          label: "Alumni",
          title: "Alumni",
          description: "Trayectorias que inspiran al Círculo de Honor.",
          Icon: GraduationCap
        }
      : null,
    config.showProductsSection !== false
      ? {
          href: "/tiendiita",
          label: "TienDIIta",
          title: "Tiendita",
          description: "Productos con identidad industrial.",
          Icon: Store,
          keepLabel: true
        }
      : null
  ] as Array<AccessItem | null>).filter((item): item is AccessItem => Boolean(item));

  return (
    <section className="shell py-10 md:py-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] p-6 md:p-10 xl:p-12" style={{ background: "var(--hero)" }}>
        <div className="relative z-10 grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
          <div className="max-w-3xl xl:pr-2">
            <span className="pill">{config.heroEyebrow || "Comunidad industrial en movimiento"}</span>
            <h1 className="mt-6 max-w-4xl text-4xl md:text-6xl" style={{ fontWeight: 650 }}>
              {config.heroTitle || "Ingeniería Industrial se escribe con"}{" "}
              <span className="text-[color:var(--accent)]">{config.heroTitleAccent || "J"}</span>
            </h1>
            <p className="text-content mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
              {config.heroDescription ||
                "Un espacio para reunir historias, conversaciones, eventos e iniciativas que conectan a la comunidad de Ingeniería Industrial de la Universidad de Chile."}
            </p>
            <div className="mt-8 sm:hidden">
              <ThemeToggle />
            </div>
          </div>

          <div className="min-w-0 xl:pt-1">
            {showVideo && youtubeEmbedUrl && videoPosterUrl ? (
              <a
                href={youtubeEmbedUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl shadow-black/40 ring-1 ring-white/5"
                aria-label="Ver video de Industrial con J en YouTube"
              >
                <img src={videoPosterUrl} alt="Portada del video de Industrial con J" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--accent)] text-white shadow-2xl shadow-black/40 transition group-hover:scale-105">
                  <Play size={28} fill="currentColor" />
                </span>
              </a>
            ) : showVideo && youtubeEmbedUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl shadow-black/40 ring-1 ring-white/5">
                <iframe
                  src={youtubeEmbedUrl}
                  title="Video de Industrial con J"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : showVideo && videoUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl shadow-black/40 ring-1 ring-white/5">
                <video autoPlay muted loop playsInline controls className="aspect-video h-full w-full object-cover" poster={videoPosterUrl}>
                  <source src={videoUrl} type={getVideoMimeType(videoUrl)} />
                </video>
              </div>
            ) : config.heroImageUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[color:var(--surface-strong)] shadow-2xl shadow-black/25 ring-1 ring-white/5">
                <img src={config.heroImageUrl} alt="Industrial con J" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className={`${hasHeroMedia || config.heroImageUrl ? "mt-6" : ""} flex flex-wrap gap-4`}>
              <Link href={config.heroPrimaryCtaHref || "/podcast"} className="btn-primary gap-2">
                {config.heroPrimaryCtaLabel || "Explorar Industrial con J"}
                <ArrowRight size={16} />
              </Link>
              <Link href={secondaryHref} className="btn-secondary">
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
