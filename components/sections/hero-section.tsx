"use client";

import { ArrowRight, CalendarDays, GraduationCap, Play, Podcast, Store, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { trackEvent } from "@/lib/analytics";
import { TrackedLink } from "@/components/analytics/tracked-link";

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

function getYouTubePlayerUrl(value: string | null) {
  const embedUrl = getYouTubeEmbedUrl(value);
  if (!embedUrl) {
    return null;
  }

  const url = new URL(embedUrl);
  url.searchParams.set("rel", "0");
  url.searchParams.set("modestbranding", "1");
  url.searchParams.set("playsinline", "1");

  return url.toString();
}

function getCtaEventName(href: string) {
  if (href.startsWith("/events")) return "click_event";
  if (href.startsWith("/tiendiita")) return "click_tiendita";
  if (href.startsWith("/donations")) return "click_donation";
  if (href.startsWith("/contact")) return "click_contact";
  return "click_episode";
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
    showThemeToggle?: boolean;
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
  const youtubePlayerUrl = getYouTubePlayerUrl(configuredVideoUrl || null);
  const videoUrl = configuredVideoUrl && isPlayableHeroVideoUrl(configuredVideoUrl) ? configuredVideoUrl : null;
  const hasHeroMedia = showVideo && (youtubePlayerUrl || videoUrl);
  const videoPosterUrl = config.heroVideoPosterUrl || config.heroImageUrl || undefined;
  const [videoStarted, setVideoStarted] = useState(!videoPosterUrl);
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
            {config.showThemeToggle ? <div className="mt-8 sm:hidden">
              <ThemeToggle />
            </div> : null}
          </div>

          <div className="min-w-0 xl:pt-1">
            {showVideo && youtubePlayerUrl && videoPosterUrl && !videoStarted ? (
              <button
                type="button"
                className="group relative aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black text-left shadow-2xl shadow-black/40 ring-1 ring-white/5"
                onClick={() => {
                  trackEvent("click_youtube", {
                    link_url: configuredVideoUrl,
                    link_text: "Reproducir video de Industrial con J",
                    content_type: "video",
                    section: "hero"
                  });
                  setVideoStarted(true);
                }}
                aria-label="Reproducir video de Industrial con J"
              >
                <img src={videoPosterUrl} alt="Portada del video de Industrial con J" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                <span className="absolute inset-0 bg-black/25" />
                <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--accent)] text-white shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
                  <Play size={26} fill="currentColor" />
                </span>
              </button>
            ) : showVideo && youtubePlayerUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl shadow-black/40 ring-1 ring-white/5">
                <iframe
                  src={videoStarted ? `${youtubePlayerUrl}&autoplay=1` : youtubePlayerUrl}
                  title="Video de Industrial con J"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : showVideo && videoUrl && videoPosterUrl && !videoStarted ? (
              <button
                type="button"
                className="group relative aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black text-left shadow-2xl shadow-black/40 ring-1 ring-white/5"
                onClick={() => setVideoStarted(true)}
                aria-label="Reproducir video de Industrial con J"
              >
                <img src={videoPosterUrl} alt="Portada del video de Industrial con J" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                <span className="absolute inset-0 bg-black/25" />
                <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--accent)] text-white shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
                  <Play size={26} fill="currentColor" />
                </span>
              </button>
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
              <TrackedLink
                href={config.heroPrimaryCtaHref || "/podcast"}
                className="btn-primary gap-2"
                eventName={getCtaEventName(config.heroPrimaryCtaHref || "/podcast")}
                eventParams={{ link_text: config.heroPrimaryCtaLabel || "Explorar Industrial con J", section: "hero_primary" }}
              >
                {config.heroPrimaryCtaLabel || "Explorar Industrial con J"}
                <ArrowRight size={16} />
              </TrackedLink>
              <TrackedLink
                href={secondaryHref}
                className="btn-secondary"
                eventName={getCtaEventName(secondaryHref)}
                eventParams={{ link_text: secondaryLabel, section: "hero_secondary" }}
              >
                {secondaryLabel}
              </TrackedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
