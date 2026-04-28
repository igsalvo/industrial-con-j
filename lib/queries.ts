import { prisma } from "@/lib/prisma";
import {
  getAllEpisodes as getMvpEpisodes,
  getAllGuests as getMvpGuests,
  getAllSponsors as getMvpSponsors,
  getEpisodeBySlug as getMvpEpisodeBySlug,
  getGuestBySlug as getMvpGuestBySlug,
  getHomepageData as getMvpHomepageData,
  getRelatedEpisodes as getMvpRelatedEpisodes,
  getSearchResults as getMvpSearchResults
} from "@/lib/mvp-data";

export const defaultSiteConfig = {
  logoUrl: null,
  showFeaturedClips: true,
  showLatestEpisodes: true,
  showSponsorsSection: true,
  showRecommendedSection: true,
  showGuestsSection: true,
  showCommunityLink: true,
  showSponsorBanner: true,
  sponsorBannerTitle: "Auspiciadores",
  heroEyebrow: "Ingenieria industrial para equipos que ejecutan",
  heroTitle: "El hub de contenido, comunidad y patrocinio de",
  heroTitleAccent: "Industrial con J",
  heroDescription: "Episodios, clips, invitados, encuestas y oportunidades para marcas que quieren hablarle a lideres de operaciones.",
  heroPrimaryCtaLabel: "Explorar episodios",
  heroPrimaryCtaHref: "/episodes",
  heroSecondaryCtaLabel: "Participar en la comunidad",
  heroSecondaryCtaHref: "/community",
  featuredClipsEyebrow: "Clips destacados",
  featuredClipsTitle: "Shorts de los capitulos",
  featuredClipsDescription: "Fragmentos cortos para destacar ideas clave y llevar trafico al episodio completo.",
  featuredClipsOrder: 1,
  latestEpisodesEyebrow: "Ultimos episodios",
  latestEpisodesTitle: "Conversaciones aplicadas a operaciones",
  latestEpisodesDescription: "Desde mejora continua hasta transformacion digital, con invitados del mundo industrial.",
  latestEpisodesOrder: 2,
  sponsorsSectionEyebrow: "Sponsors",
  sponsorsSectionTitle: "Marcas alineadas con la industria",
  sponsorsSectionDescription: "Espacio para patrocinadores destacados y oportunidades de partnership por episodio.",
  sponsorsSectionOrder: 3,
  recommendedSectionEyebrow: "Recomendados",
  recommendedSectionTitle: "Episodios que merecen otra escucha",
  recommendedSectionDescription: "Selecciones editoriales para facilitar descubrimiento y aumentar tiempo de sesion.",
  recommendedSectionOrder: 4,
  guestsSectionEyebrow: "Invitados",
  guestsSectionTitle: "Voces del ecosistema industrial",
  guestsSectionDescription: "Expertos, operadores y lideres que aterrizan teoria en ejecucion.",
  guestsSectionOrder: 5
} as const;

export const publicEpisodeInclude = {
  guests: true,
  sponsor: true,
  surveys: {
    where: { status: "PUBLISHED" },
    include: {
      questions: {
        orderBy: {
          position: "asc"
        }
      }
    }
  }
} as const;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getSiteConfig() {
  if (!hasDatabase()) {
    return defaultSiteConfig;
  }

  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: "default" }
    });

    if (!config) {
      return defaultSiteConfig;
    }

    return config;
  } catch {
    return defaultSiteConfig;
  }
}

export async function getHomepageData() {
  if (!hasDatabase()) {
    return getMvpHomepageData();
  }

  try {
    const [featuredClips, latestEpisodes, recommendedEpisodes, sponsors, guests] = await Promise.all([
      prisma.episode.findMany({
        where: {
          isVisible: true,
          OR: [{ clipThumbnailUrl: { not: null } }, { clipVideoUrl: { not: null } }]
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { guests: true, sponsor: true }
      }),
      prisma.episode.findMany({
        where: { isVisible: true },
        orderBy: { publishedAt: "desc" },
        take: 6,
        include: { guests: true, sponsor: true }
      }),
      prisma.episode.findMany({
        where: { isFeatured: true, isVisible: true },
        orderBy: { publishedAt: "desc" },
        take: 4,
        include: { guests: true, sponsor: true }
      }),
      prisma.sponsor.findMany({
        where: { isVisible: true },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
      }),
      prisma.guest.findMany({
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
        take: 4
      })
    ]);

    return { featuredClips, latestEpisodes, recommendedEpisodes, sponsors, guests };
  } catch {
    return getMvpHomepageData();
  }
}

export async function getEpisodeBySlug(slug: string) {
  if (!hasDatabase()) {
    return getMvpEpisodeBySlug(slug);
  }

  try {
    return await prisma.episode.findFirst({
      where: { slug, isVisible: true },
      include: publicEpisodeInclude
    });
  } catch {
    return getMvpEpisodeBySlug(slug);
  }
}

export async function getRelatedEpisodes(tags: string[], episodeId: string) {
  if (!hasDatabase()) {
    return getMvpRelatedEpisodes(tags, episodeId);
  }

  if (tags.length === 0) {
    return [];
  }

  try {
    return await prisma.episode.findMany({
      where: {
        isVisible: true,
        id: { not: episodeId },
        tags: { hasSome: tags }
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { guests: true, sponsor: true }
    });
  } catch {
    return getMvpRelatedEpisodes(tags, episodeId);
  }
}

export async function getGuestBySlug(slug: string) {
  if (!hasDatabase()) {
    return getMvpGuestBySlug(slug);
  }

  try {
    return await prisma.guest.findFirst({
      where: { slug, isVisible: true },
      include: {
        episodes: {
          where: { isVisible: true },
          include: { sponsor: true, guests: true },
          orderBy: { publishedAt: "desc" }
        }
      }
    });
  } catch {
    return getMvpGuestBySlug(slug);
  }
}

export async function getSearchResults(searchParams: {
  q?: string;
  guest?: string;
  tag?: string;
  industry?: string;
}) {
  if (!hasDatabase()) {
    return getMvpSearchResults(searchParams);
  }

  const term = searchParams.q?.trim();

  try {
    const episodes = await prisma.episode.findMany({
      where: {
        AND: [
          { isVisible: true },
          term
            ? {
                OR: [
                  { title: { contains: term, mode: "insensitive" } },
                  { shortDescription: { contains: term, mode: "insensitive" } },
                  { longDescription: { contains: term, mode: "insensitive" } },
                  { tags: { has: term } },
                  { industries: { has: term } }
                ]
              }
            : {},
          searchParams.tag ? { tags: { has: searchParams.tag } } : {},
          searchParams.industry ? { industries: { has: searchParams.industry } } : {},
          searchParams.guest
            ? {
                guests: {
                  some: {
                    slug: searchParams.guest
                  }
                }
              }
            : {}
        ]
      },
      include: { guests: true, sponsor: true },
      orderBy: { publishedAt: "desc" }
    });

    const [guests, allGuests] = await Promise.all([
      prisma.guest.findMany({
        where: {
          isVisible: true,
          ...(term
            ? {
                OR: [
                  { name: { contains: term, mode: "insensitive" } },
                  { bio: { contains: term, mode: "insensitive" } },
                  { company: { contains: term, mode: "insensitive" } }
                ]
              }
            : {})
        },
        include: {
          episodes: {
            where: { isVisible: true },
            orderBy: { publishedAt: "desc" },
            take: 3
          }
        },
        orderBy: { name: "asc" }
      }),
      prisma.guest.findMany({
        where: { isVisible: true },
        orderBy: { name: "asc" }
      })
    ]);

    const distinctTags = Array.from(new Set(episodes.flatMap((episode: (typeof episodes)[number]) => episode.tags))).sort();
    const distinctIndustries = Array.from(new Set(episodes.flatMap((episode: (typeof episodes)[number]) => episode.industries))).sort();

    return {
      episodes,
      guests,
      filters: {
        guests: allGuests,
        tags: distinctTags,
        industries: distinctIndustries
      }
    };
  } catch {
    return getMvpSearchResults(searchParams);
  }
}

export async function getAllEpisodes() {
  if (!hasDatabase()) {
    return getMvpEpisodes();
  }

  try {
    return await prisma.episode.findMany({
      where: { isVisible: true },
      include: { guests: true, sponsor: true },
      orderBy: { publishedAt: "desc" }
    });
  } catch {
    return getMvpEpisodes();
  }
}

export async function getAllGuests() {
  if (!hasDatabase()) {
    return getMvpGuests();
  }

  try {
    return await prisma.guest.findMany({
      where: { isVisible: true },
      include: {
        episodes: {
          where: { isVisible: true },
          orderBy: { publishedAt: "desc" },
          include: { sponsor: true, guests: true }
        }
      },
      orderBy: { name: "asc" }
    });
  } catch {
    return getMvpGuests();
  }
}

export async function getAllSponsors() {
  if (!hasDatabase()) {
    return getMvpSponsors();
  }

  try {
    return await prisma.sponsor.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
    });
  } catch {
    return getMvpSponsors();
  }
}
