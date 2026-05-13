import { prisma } from "@/lib/prisma";

export const defaultSiteConfig = {
  logoUrl: null,
  showPodcastSection: true,
  showHeroSection: true,
  showFeaturedClips: true,
  showLatestEpisodes: true,
  showSponsorsSection: true,
  showRecommendedSection: false,
  showGuestsSection: true,
  showIdentitySection: true,
  showHonorSection: true,
  showProductsSection: true,
  showEventsSection: true,
  showParticipationSection: true,
  showCommunityLink: true,
  showContactLink: true,
  showDonationsSection: true,
  showSponsorBanner: true,
  sponsorBannerTitle: "Aliados",
  heroEyebrow: "Comunidad industrial en movimiento",
  heroTitle: "Ingeniería Industrial se escribe con",
  heroTitleAccent: "J",
  heroDescription: "Un espacio para reunir historias, conversaciones, eventos e iniciativas que conectan a la comunidad de Ingeniería Industrial de la Universidad de Chile.",
  heroPrimaryCtaLabel: "Explorar Industrial con J",
  heroPrimaryCtaHref: "/podcast",
  heroSecondaryCtaLabel: "Ver eventos",
  heroSecondaryCtaHref: "/events",
  heroImageUrl: null,
  heroVideoUrl: null,
  heroVideoPosterUrl: null,
  heroVideoEnabled: false,
  heroOrder: 0,
  featuredClipsEyebrow: "Clips destacados",
  featuredClipsTitle: "Shorts de los capítulos",
  featuredClipsDescription: "Fragmentos cortos para destacar ideas clave y llevar tráfico al episodio completo.",
  featuredClipsOrder: 1,
  latestEpisodesEyebrow: "Últimos episodios",
  latestEpisodesTitle: "Conversaciones aplicadas a operaciones",
  latestEpisodesDescription: "Desde mejora continua hasta transformación digital, con invitados del mundo industrial.",
  latestEpisodesOrder: 2,
  sponsorsSectionEyebrow: "Aliados",
  sponsorsSectionTitle: "Aliados de Industrial con J",
  sponsorsSectionDescription: "Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial.",
  sponsorsSectionOrder: 3,
  donationsSectionEyebrow: "Donaciones",
  donationsSectionTitle: "Apoya nuevas conversaciones industriales",
  donationsSectionDescription: "Deja tus datos para coordinar una donación, alianza o apoyo al proyecto.",
  donationsSectionOrder: 4,
  donationUrl: null,
  recommendedSectionEyebrow: "Recomendados",
  recommendedSectionTitle: "Episodios que merecen otra escucha",
  recommendedSectionDescription: "Selecciones editoriales para facilitar descubrimiento y aumentar tiempo de sesión.",
  recommendedSectionOrder: 4,
  guestsSectionEyebrow: "Invitados",
  guestsSectionTitle: "Voces del ecosistema industrial",
  guestsSectionDescription: "Expertos, operadores y líderes que aterrizan teoría en ejecución.",
  guestsSectionOrder: 6,
  identitySectionEyebrow: "Identidad",
  identitySectionTitle: "Lo que mueve Industrial con J",
  identitySectionDescription: "Propósito, visión, misión y valores editables desde el administrador.",
  identitySectionOrder: 6,
  honorSectionEyebrow: "Alumni",
  honorSectionTitle: "Personas que abren camino",
  honorSectionDescription: "Reconocimientos y perfiles destacados del ecosistema industrial.",
  honorSectionOrder: 7,
  productsSectionEyebrow: "TienDIIta CEIN",
  productsSectionTitle: "Productos con identidad industrial",
  productsSectionDescription: "Artículos, recuerdos y productos pensados para quienes quieren llevar consigo parte de la comunidad de Ingeniería Industrial.",
  productsSectionOrder: 8,
  eventsSectionEyebrow: "Eventos",
  eventsSectionTitle: "Próximas actividades",
  eventsSectionDescription: "Calendario de encuentros, hitos y actividades abiertas para la comunidad.",
  eventsSectionOrder: 9,
  participationSectionEyebrow: "Participa",
  participationSectionTitle: "Donaciones, auspicios y comunidad",
  participationSectionDescription: "Formas concretas de apoyar, auspiciar o participar.",
  participationSectionOrder: 10,
  contactPageEyebrow: "Contacto",
  contactPageTitle: "Contáctanos",
  contactPageDescription: "¿Tienes una idea, propuesta o quieres ser parte? Escríbenos y conversemos.",
  communityPageEyebrow: "COMUNIDAD",
  communityPageTitle: "Participa en Industrial con J",
  communityPageDescription: "Queremos escuchar tus ideas, preguntas y comentarios. Propón temas, recomienda invitados o cuéntanos cómo te gustaría ser parte de esta comunidad.",
  communityEmptyTitle: "No hay preguntas activas por ahora",
  communityEmptyDescription: "Pronto abriremos nuevos espacios para que puedas compartir tus ideas, preguntas y opiniones con la comunidad.",
  communityContactTitle: "Queremos escucharte",
  communityContactDescription: "Déjanos tu comentario, idea o propuesta.",
  communityContactSubmitLabel: "Enviar mensaje",
  donationsContactTitle: "Donaciones y alianzas",
  donationsContactDescription: "Déjanos tus datos y cuéntanos cómo te gustaría colaborar. Nos pondremos en contacto contigo para coordinar los próximos pasos.",
  donationsContactSubmitLabel: "Quiero apoyar",
  episodesPageEyebrow: "CONTENIDO",
  episodesPageTitle: "Episodios",
  episodesPageDescription: "Conversaciones con personas de la comunidad industrial sobre trayectorias, aprendizajes, decisiones y desafíos que conectan la ingeniería con el mundo real.",
  guestsPageEyebrow: "Invitados",
  guestsPageTitle: "Personas que construyen industria",
  guestsPageDescription: "Perfiles, empresas, enlaces sociales y episodios donde participan.",
  sponsorsPageEyebrow: "ALIADOS",
  sponsorsPageTitle: "Aliados de Industrial con J",
  sponsorsPageDescription: "Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial.",
  footerTitle: "Industrial con J",
  footerDescription: "Historias, conversaciones e iniciativas que conectan a la comunidad de Ingeniería Industrial."
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

export type PublicMediaItem = {
  id: string;
  section: string;
  src: string;
  alt: string;
  label: string | null;
  href: string | null;
  positionX: string;
  positionY: string;
  order: number;
  isFeatured: boolean;
};

export async function getMediaItems(section: string): Promise<PublicMediaItem[]> {
  if (!hasDatabase()) {
    return [];
  }

  try {
    return await prisma.mediaItem.findMany({
      where: { section, isVisible: true },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }]
    });
  } catch {
    return [];
  }
}

export async function getMediaItemsBySections(sections: string[]) {
  if (!hasDatabase() || sections.length === 0) {
    return Object.fromEntries(sections.map((section) => [section, [] as PublicMediaItem[]]));
  }

  try {
    const items = await prisma.mediaItem.findMany({
      where: { section: { in: sections }, isVisible: true },
      orderBy: [{ section: "asc" }, { order: "asc" }, { updatedAt: "desc" }]
    });

    return Object.fromEntries(sections.map((section) => [section, items.filter((item) => item.section === section)]));
  } catch {
    return Object.fromEntries(sections.map((section) => [section, [] as PublicMediaItem[]]));
  }
}

export async function getHomepageData() {
  if (!hasDatabase()) {
    return {
      featuredClips: [],
      latestEpisodes: [],
      recommendedEpisodes: [],
      sponsors: [],
      guests: [],
      identityItems: [],
      honorMembers: [],
      products: [],
      events: [],
      participationItems: []
    };
  }

  try {
    const [featuredClips, latestEpisodes, recommendedEpisodes, sponsors, guests, identityItems, honorMembers, products, events, participationItems] = await Promise.all([
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
      }),
      prisma.identityItem.findMany({
        where: { isVisible: true },
        orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
        take: 4
      }),
      prisma.honorMember.findMany({
        where: { isVisible: true },
        orderBy: [{ name: "asc" }],
        take: 4
      }),
      prisma.product.findMany({
        where: { isVisible: true, category: { isVisible: true } },
        include: { category: true },
        orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
        take: 4
      }),
      prisma.event.findMany({
        where: { isVisible: true, startsAt: { gte: new Date() } },
        orderBy: [{ startsAt: "asc" }, { order: "asc" }],
        take: 4
      }),
      prisma.participationItem.findMany({
        where: { isVisible: true },
        orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
        take: 3
      })
    ]);

    return { featuredClips, latestEpisodes, recommendedEpisodes, sponsors, guests, identityItems, honorMembers, products, events, participationItems };
  } catch (error) {
    console.error("Homepage data query failed", error);
    return {
      featuredClips: [],
      latestEpisodes: [],
      recommendedEpisodes: [],
      sponsors: [],
      guests: [],
      identityItems: [],
      honorMembers: [],
      products: [],
      events: [],
      participationItems: []
    };
  }
}

export async function getPublicSectionsData() {
  if (!hasDatabase()) {
    return { identityItems: [], honorMembers: [], products: [], categories: [], events: [], participationItems: [] };
  }

  try {
    const [identityItems, honorMembers, products, categories, events, participationItems] = await Promise.all([
      prisma.identityItem.findMany({
        where: { isVisible: true },
        orderBy: [{ order: "asc" }, { updatedAt: "desc" }]
      }),
      prisma.honorMember.findMany({
        where: { isVisible: true },
        orderBy: [{ name: "asc" }]
      }),
      prisma.product.findMany({
        where: { isVisible: true, category: { isVisible: true } },
        include: { category: true },
        orderBy: [{ order: "asc" }, { name: "asc" }]
      }),
      prisma.productCategory.findMany({
        where: { isVisible: true },
        orderBy: [{ order: "asc" }, { name: "asc" }]
      }),
      prisma.event.findMany({
        where: { isVisible: true },
        orderBy: [{ startsAt: "asc" }, { order: "asc" }]
      }),
      prisma.participationItem.findMany({
        where: { isVisible: true },
        orderBy: [{ order: "asc" }, { updatedAt: "desc" }]
      })
    ]);

    return { identityItems, honorMembers, products, categories, events, participationItems };
  } catch {
    return { identityItems: [], honorMembers: [], products: [], categories: [], events: [], participationItems: [] };
  }
}

export async function getCalendarSources() {
  if (!hasDatabase()) {
    return [];
  }

  try {
    return await prisma.calendarSource.findMany({
      where: { isVisible: true },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }]
    });
  } catch {
    return [];
  }
}

export async function getEpisodeBySlug(slug: string) {
  if (!hasDatabase()) {
    return null;
  }

  try {
    return await prisma.episode.findFirst({
      where: { slug, isVisible: true },
      include: publicEpisodeInclude
    });
  } catch (error) {
    console.error("Episode query failed", error);
    return null;
  }
}

export async function getRelatedEpisodes(tags: string[], episodeId: string) {
  if (!hasDatabase()) {
    return [];
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
  } catch (error) {
    console.error("Related episodes query failed", error);
    return [];
  }
}

export async function getGuestBySlug(slug: string) {
  if (!hasDatabase()) {
    return null;
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
  } catch (error) {
    console.error("Guest query failed", error);
    return null;
  }
}

export async function getSearchResults(searchParams: {
  q?: string;
  guest?: string;
  tag?: string;
  industry?: string;
}) {
  if (!hasDatabase()) {
    return { episodes: [], guests: [], filters: { guests: [], tags: [], industries: [] } };
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
  } catch (error) {
    console.error("Search query failed", error);
    return { episodes: [], guests: [], filters: { guests: [], tags: [], industries: [] } };
  }
}

export async function getAllEpisodes() {
  if (!hasDatabase()) {
    return [];
  }

  try {
    return await prisma.episode.findMany({
      where: { isVisible: true },
      include: { guests: true, sponsor: true },
      orderBy: { publishedAt: "desc" }
    });
  } catch (error) {
    console.error("Episodes query failed", error);
    return [];
  }
}

export async function getAllGuests() {
  if (!hasDatabase()) {
    return [];
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
  } catch (error) {
    console.error("Guests query failed", error);
    return [];
  }
}

export async function getAllSponsors() {
  if (!hasDatabase()) {
    return [];
  }

  try {
    return await prisma.sponsor.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
    });
  } catch (error) {
    console.error("Sponsors query failed", error);
    return [];
  }
}
