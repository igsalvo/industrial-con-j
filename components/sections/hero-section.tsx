import Link from "next/link";
import { ArrowRight, CalendarDays, GraduationCap, Podcast, Store, type LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

type AccessItem = {
  href: string;
  label: string;
  title: string;
  Icon: LucideIcon;
  ariaLabel?: string;
  keepLabel?: boolean;
};

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
  const accessItems = ([
    config.showPodcastSection !== false
      ? {
          href: "/podcast",
          label: "Podcast",
          Icon: Podcast
        }
      : null,
    config.showEventsSection !== false
      ? {
          href: "/events",
          label: "Eventos",
          Icon: CalendarDays,
          ariaLabel: "Ver eventos"
        }
      : null,
    config.showHonorSection !== false
      ? {
          href: "/honor",
          label: "Alumni",
          Icon: GraduationCap
        }
      : null,
    config.showProductsSection !== false
      ? {
          href: "/tiendiita",
          label: "TienDIIta",
          Icon: Store,
          keepLabel: true
        }
      : null
  ] as Array<AccessItem | null>).filter((item): item is AccessItem => Boolean(item));

  return (
    <section className="shell py-10 md:py-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] p-6 md:p-10 xl:p-12" style={{ background: "var(--hero)" }}>
        <div className="relative z-10 grid gap-8 xl:grid-cols-[0.85fr_1.15fr] xl:items-center">
          <div className="max-w-3xl xl:pr-2">
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

          <div className="min-w-0">
            {showVideo && youtubeEmbedUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-2xl shadow-black/35 ring-1 ring-white/5">
                <iframe
                  src={youtubeEmbedUrl}
                  title="Video de Industrial con J"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : showVideo && videoUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-2xl shadow-black/35 ring-1 ring-white/5">
                <video autoPlay muted loop playsInline controls className="aspect-video h-full w-full object-cover" poster={config.heroImageUrl || undefined}>
                  <source src={videoUrl} type="video/mp4" />
                </video>
              </div>
            ) : config.heroImageUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[color:var(--surface-strong)] shadow-2xl shadow-black/25 ring-1 ring-white/5">
                <img src={config.heroImageUrl} alt="Industrial con J" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className={`grid gap-3 ${hasHeroMedia ? "mt-4" : config.heroImageUrl ? "mt-4" : ""} grid-cols-2 2xl:grid-cols-4`}>
              {accessItems.map((item) => {
                const { Icon } = item;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex min-h-20 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-4 text-center transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-white/[0.075] hover:shadow-lg hover:shadow-black/20"
                    aria-label={item.ariaLabel}
                  >
                    <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-[color:var(--accent)] transition group-hover:border-[color:var(--accent)]/45 group-hover:bg-[color:var(--accent-soft)]">
                      <Icon size={18} />
                    </span>
                    <span className={`block text-sm leading-none md:text-base ${item.keepLabel ? "notranslate" : ""}`} translate={item.keepLabel ? "no" : undefined} style={{ fontWeight: 650 }}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
