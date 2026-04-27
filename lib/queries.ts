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
  showFeaturedClips: true,
  showLatestEpisodes: true,
  showSponsorsSection: true,
  showRecommendedSection: true,
  showGuestsSection: true,
  showCommunityLink: true,
  showSponsorBanner: true,
  sponsorBannerTitle: "Auspiciadores"
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

  const config = await prisma.siteConfig.findUnique({
    where: { id: "default" }
  });

  if (!config) {
    return defaultSiteConfig;
  }

  return config;
}

export async function getHomepageData() {
  if (!hasDatabase()) {
    return getMvpHomepageData();
  }

  const [featuredClips, latestEpisodes, recommendedEpisodes, sponsors, guests] = await Promise.all([
    prisma.episode.findMany({
      where: {
        clipThumbnailUrl: { not: null }
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { guests: true, sponsor: true }
    }),
    prisma.episode.findMany({
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { guests: true, sponsor: true }
    }),
    prisma.episode.findMany({
      where: { isFeatured: true },
      orderBy: { publishedAt: "desc" },
      take: 4,
      include: { guests: true, sponsor: true }
    }),
    prisma.sponsor.findMany({
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
    }),
    prisma.guest.findMany({
      orderBy: { createdAt: "desc" },
      take: 4
    })
  ]);

  return { featuredClips, latestEpisodes, recommendedEpisodes, sponsors, guests };
}

export async function getEpisodeBySlug(slug: string) {
  if (!hasDatabase()) {
    return getMvpEpisodeBySlug(slug);
  }

  return prisma.episode.findUnique({
    where: { slug },
    include: publicEpisodeInclude
  });
}

export async function getRelatedEpisodes(tags: string[], episodeId: string) {
  if (!hasDatabase()) {
    return getMvpRelatedEpisodes(tags, episodeId);
  }

  if (tags.length === 0) {
    return [];
  }

  return prisma.episode.findMany({
    where: {
      id: { not: episodeId },
      tags: { hasSome: tags }
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { guests: true, sponsor: true }
  });
}

export async function getGuestBySlug(slug: string) {
  if (!hasDatabase()) {
    return getMvpGuestBySlug(slug);
  }

  return prisma.guest.findUnique({
    where: { slug },
    include: {
      episodes: {
        include: { sponsor: true, guests: true },
        orderBy: { publishedAt: "desc" }
      }
    }
  });
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

  const episodes = await prisma.episode.findMany({
    where: {
      AND: [
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
      where: term
        ? {
            OR: [
              { name: { contains: term, mode: "insensitive" } },
              { bio: { contains: term, mode: "insensitive" } },
              { company: { contains: term, mode: "insensitive" } }
            ]
          }
        : undefined,
      include: {
        episodes: {
          orderBy: { publishedAt: "desc" },
          take: 3
        }
      },
      orderBy: { name: "asc" }
    }),
    prisma.guest.findMany({
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
}

export async function getAllEpisodes() {
  if (!hasDatabase()) {
    return getMvpEpisodes();
  }

  return prisma.episode.findMany({
    include: { guests: true, sponsor: true },
    orderBy: { publishedAt: "desc" }
  });
}

export async function getAllGuests() {
  if (!hasDatabase()) {
    return getMvpGuests();
  }

  return prisma.guest.findMany({
    orderBy: { name: "asc" }
  });
}

export async function getAllSponsors() {
  if (!hasDatabase()) {
    return getMvpSponsors();
  }

  return prisma.sponsor.findMany({
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
  });
}
