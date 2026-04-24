import { prisma } from "@/lib/prisma";

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
};

export async function getHomepageData() {
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
  return prisma.episode.findUnique({
    where: { slug },
    include: publicEpisodeInclude
  });
}

export async function getRelatedEpisodes(tags: string[], episodeId: string) {
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

  const distinctTags = Array.from(new Set(episodes.flatMap((episode) => episode.tags))).sort();
  const distinctIndustries = Array.from(new Set(episodes.flatMap((episode) => episode.industries))).sort();

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
