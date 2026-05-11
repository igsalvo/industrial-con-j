import Link from "next/link";
import { ArrowRight, CalendarDays, GraduationCap, Podcast, Store } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

function isPlayableHeroVideoUrl(value: string) {
  if (value.startsWith("/")) {
    return /\.mp4(?:\?.*)?$/i.test(value);
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && /\.mp4$/i.test(url.pathname);
  } catch {
    return false;
  }
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
  const videoUrl = configuredVideoUrl && isPlayableHeroVideoUrl(configuredVideoUrl) ? configuredVideoUrl : youtubeEmbedUrl ? null : "/hero-video.mp4";
  const hasHeroMedia = showVideo && (youtubeEmbedUrl || videoUrl);

  return (
    <section className="shell py-10 md:py-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] p-8 md:p-12" style={{ background: "var(--hero)" }}>
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="pill">{config.heroEyebrow || "Comunidad industrial en movimiento"}</span>
            <h1 className="mt-6 max-w-4xl text-4xl md:text-6xl" style={{ fontWeight: 600 }}>
              {config.heroTitle || "Contenido, eventos y comunidad de"}{" "}
              <span className="text-[color:var(--accent)]">{config.heroTitleAccent || "Industrial con J"}</span>
            </h1>
            <p className="text-content mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
              {config.heroDescription ||
                "Un espacio para conectar ideas, personas, eventos, alumni, productos e iniciativas del ecosistema industrial."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={config.heroPrimaryCtaHref || "/podcast"} className="btn-primary gap-2">
                {config.heroPrimaryCtaLabel || "Explorar plataforma"}
                <ArrowRight size={16} />
              </Link>
              <Link href={secondaryHref} className="btn-secondary">
                {secondaryLabel}
              </Link>
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div>
            {showVideo && youtubeEmbedUrl ? (
              <div className="aspect-video overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-black">
                <iframe
                  src={youtubeEmbedUrl}
                  title="Video de Industrial con J"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : showVideo && videoUrl ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-black">
                <video autoPlay muted loop playsInline controls className="aspect-video h-full w-full object-cover" poster={config.heroImageUrl || undefined}>
                  <source src={videoUrl} type="video/mp4" />
                </video>
              </div>
            ) : config.heroImageUrl ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)]">
                <img src={config.heroImageUrl} alt="Industrial con J" className="aspect-[4/3] h-full w-full object-cover" />
              </div>
            ) : null}
            <div className={`grid gap-4 ${hasHeroMedia ? "mt-4" : config.heroImageUrl ? "mt-4" : ""} sm:grid-cols-2`}>
              {config.showPodcastSection !== false ? (
                <Link href="/podcast" className="card block p-6 transition hover:-translate-y-1 hover:border-[color:var(--accent)]">
                  <Podcast className="text-[color:var(--accent)]" />
                  <p className="brand-kicker mt-4 text-sm text-[color:var(--muted)]">Podcast</p>
                  <p className="mt-3 text-3xl" style={{ fontWeight: 600 }}>Episodios e invitados</p>
                </Link>
              ) : null}
              {config.showEventsSection !== false ? (
                <Link href="/events" className="card block p-6 transition hover:-translate-y-1 hover:border-[color:var(--accent)]" aria-label="Ver eventos">
                  <CalendarDays className="text-[color:var(--accent)]" />
                  <p className="brand-kicker mt-4 text-sm text-[color:var(--muted)]">Eventos</p>
                  <p className="mt-3 text-3xl" style={{ fontWeight: 600 }}>Calendario y actividades</p>
                </Link>
              ) : null}
              {config.showHonorSection !== false ? (
                <Link href="/honor" className="card block p-6 transition hover:-translate-y-1 hover:border-[color:var(--accent)]">
                  <GraduationCap className="text-[color:var(--accent)]" />
                  <p className="brand-kicker mt-4 text-sm text-[color:var(--muted)]">Alumni</p>
                  <p className="mt-3 text-3xl" style={{ fontWeight: 600 }}>Red y trayectorias</p>
                </Link>
              ) : null}
              {config.showProductsSection !== false ? (
                <Link href="/tiendiita" className="card block p-6 transition hover:-translate-y-1 hover:border-[color:var(--accent)]">
                  <Store className="text-[color:var(--accent)]" />
                  <p className="brand-kicker notranslate mt-4 text-sm text-[color:var(--muted)]" translate="no">TienDIIta</p>
                  <p className="mt-3 text-3xl" style={{ fontWeight: 600 }}>Productos e iniciativas</p>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
