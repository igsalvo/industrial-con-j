export type MvpSponsor = {
  id: string;
  slug: string;
  name: string;
  websiteUrl: string;
  logoUrl: string | null;
  tier: string | null;
  description?: string;
};

export type MvpGuest = {
  id: string;
  slug: string;
  name: string;
  company: string | null;
  role: string | null;
  bio: string;
  profileImage: string | null;
  socialLinks?: Record<string, string>;
};

export type MvpEpisode = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  timestamps: string[];
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  applePodcastsUrl: string | null;
  videoEmbedUrl: string | null;
  audioEmbedUrl: string | null;
  clipThumbnailUrl: string | null;
  tags: string[];
  industries: string[];
  publishedAt: Date;
  resourceLinks: Array<{ label: string; url: string }>;
  guestSlugs: string[];
  sponsorSlug: string | null;
  isFeatured?: boolean;
};

const sponsors: MvpSponsor[] = [
  {
    id: "sponsor-planta-digital",
    slug: "planta-digital",
    name: "Planta Digital",
    websiteUrl: "https://example.com/planta-digital",
    logoUrl: null,
    tier: "Gold",
    description: "Analitica operacional y visibilidad de planta para equipos industriales."
  },
  {
    id: "sponsor-maintflow",
    slug: "maintflow",
    name: "MaintFlow",
    websiteUrl: "https://example.com/maintflow",
    logoUrl: null,
    tier: "Silver",
    description: "Software de mantenimiento para operaciones que necesitan trazabilidad."
  },
  {
    id: "sponsor-supply-grid",
    slug: "supply-grid",
    name: "Supply Grid",
    websiteUrl: "https://example.com/supply-grid",
    logoUrl: null,
    tier: "Partner",
    description: "Optimizacion de compras y abastecimiento para equipos industriales."
  }
];

const guests: MvpGuest[] = [
  {
    id: "guest-camila-rojas",
    slug: "camila-rojas",
    name: "Camila Rojas",
    company: "Andes Manufacturing",
    role: "Head of Operations",
    bio: "Ingeniera industrial enfocada en transformacion digital, productividad y liderazgo de operaciones.",
    profileImage: null,
    socialLinks: {
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "guest-matias-perez",
    slug: "matias-perez",
    name: "Matias Perez",
    company: "Norte Logistica",
    role: "Supply Chain Manager",
    bio: "Especialista en abastecimiento, planificacion y reduccion de desperdicios en cadenas operativas.",
    profileImage: null,
    socialLinks: {
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "guest-valentina-ibarra",
    slug: "valentina-ibarra",
    name: "Valentina Ibarra",
    company: "Mineria 4.0",
    role: "Continuous Improvement Lead",
    bio: "Trabaja en mejora continua aplicada a mineria, seguridad operacional y sistemas de gestion.",
    profileImage: null,
    socialLinks: {
      linkedin: "https://linkedin.com"
    }
  }
];

const episodes: MvpEpisode[] = [
  {
    id: "episode-transformacion-digital",
    slug: "ingenieria-industrial-y-transformacion-digital",
    title: "Ingenieria Industrial y Transformacion Digital",
    shortDescription: "Como pasar de eficiencias marginales a una operacion guiada por datos.",
    longDescription:
      "Conversacion sobre indicadores, decisiones de planta, automatizacion pragmatica y la cultura operativa necesaria para escalar mejoras continuas.",
    timestamps: [
      "00:00 Introduccion",
      "06:45 Cuellos de botella invisibles",
      "18:10 KPI accionables",
      "31:40 Automatizacion bien hecha",
      "44:20 Recomendaciones finales"
    ],
    spotifyUrl: "https://open.spotify.com",
    youtubeUrl: "https://youtube.com",
    applePodcastsUrl: "https://podcasts.apple.com",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    audioEmbedUrl: null,
    clipThumbnailUrl: null,
    tags: ["Transformacion Digital", "KPI", "Lean"],
    industries: ["Manufacturing", "Logistics"],
    publishedAt: new Date("2026-03-10T12:00:00.000Z"),
    resourceLinks: [
      { label: "Checklist de madurez digital", url: "https://example.com/checklist.pdf" }
    ],
    guestSlugs: ["camila-rojas"],
    sponsorSlug: "planta-digital",
    isFeatured: true
  },
  {
    id: "episode-abastecimiento",
    slug: "abastecimiento-sin-caos",
    title: "Abastecimiento sin caos",
    shortDescription: "Planificacion, proveedores y visibilidad para evitar urgencias permanentes.",
    longDescription:
      "Un episodio practico sobre compras, forecast, stocks criticos y como evitar que la operacion viva apagando incendios.",
    timestamps: ["00:00 Contexto", "12:30 Forecast", "25:10 Proveedores", "39:00 Cierre"],
    spotifyUrl: "https://open.spotify.com",
    youtubeUrl: "https://youtube.com",
    applePodcastsUrl: null,
    videoEmbedUrl: null,
    audioEmbedUrl: null,
    clipThumbnailUrl: null,
    tags: ["Supply Chain", "Abastecimiento", "Planificacion"],
    industries: ["Logistics", "Retail"],
    publishedAt: new Date("2026-02-18T12:00:00.000Z"),
    resourceLinks: [],
    guestSlugs: ["matias-perez"],
    sponsorSlug: "supply-grid",
    isFeatured: true
  },
  {
    id: "episode-mejora-continua",
    slug: "mejora-continua-en-terreno",
    title: "Mejora continua en terreno",
    shortDescription: "Como aterrizar iniciativas de mejora en equipos reales y no en slides.",
    longDescription:
      "Conversacion sobre liderazgo de turno, seguridad, kaizen y como sostener mejoras con disciplina operacional.",
    timestamps: ["00:00 Apertura", "10:10 Seguridad", "22:30 Kaizen", "35:00 Cultura"],
    spotifyUrl: "https://open.spotify.com",
    youtubeUrl: null,
    applePodcastsUrl: null,
    videoEmbedUrl: null,
    audioEmbedUrl: null,
    clipThumbnailUrl: null,
    tags: ["Mejora Continua", "Kaizen", "Seguridad"],
    industries: ["Mining", "Manufacturing"],
    publishedAt: new Date("2026-01-20T12:00:00.000Z"),
    resourceLinks: [],
    guestSlugs: ["valentina-ibarra"],
    sponsorSlug: "maintflow"
  }
];

export function getAllSponsors() {
  return sponsors;
}

export function getAllGuests() {
  return guests;
}

export function getAllEpisodes() {
  return episodes.map(enrichEpisode).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function getHomepageData() {
  const allEpisodes = getAllEpisodes();

  return {
    featuredClips: allEpisodes.slice(0, 3),
    latestEpisodes: allEpisodes.slice(0, 6),
    recommendedEpisodes: allEpisodes.filter((episode) => episode.isFeatured).slice(0, 4),
    sponsors,
    guests: guests.slice(0, 4)
  };
}

export function getEpisodeBySlug(slug: string) {
  const episode = episodes.find((item) => item.slug === slug);
  return episode ? enrichEpisode(episode) : null;
}

export function getRelatedEpisodes(tags: string[], episodeId: string) {
  return getAllEpisodes()
    .filter((episode) => episode.id !== episodeId && episode.tags.some((tag) => tags.includes(tag)))
    .slice(0, 3);
}

export function getGuestBySlug(slug: string) {
  const guest = guests.find((item) => item.slug === slug);

  if (!guest) {
    return null;
  }

  return {
    ...guest,
    episodes: getAllEpisodes().filter((episode) => episode.guests.some((item) => item.slug === slug))
  };
}

export function getSearchResults(searchParams: {
  q?: string;
  guest?: string;
  tag?: string;
  industry?: string;
}) {
  const allEpisodes = getAllEpisodes();
  const allGuests = getAllGuests();
  const term = searchParams.q?.trim().toLowerCase() ?? "";

  const filteredEpisodes = allEpisodes.filter((episode) => {
    const matchesTerm =
      !term ||
      [episode.title, episode.shortDescription, episode.longDescription, ...episode.tags, ...episode.industries]
        .join(" ")
        .toLowerCase()
        .includes(term);

    const matchesGuest = !searchParams.guest || episode.guests.some((guest) => guest.slug === searchParams.guest);
    const matchesTag = !searchParams.tag || episode.tags.includes(searchParams.tag);
    const matchesIndustry = !searchParams.industry || episode.industries.includes(searchParams.industry);

    return matchesTerm && matchesGuest && matchesTag && matchesIndustry;
  });

  const filteredGuests = allGuests.filter((guest) => {
    if (!term) {
      return true;
    }

    return [guest.name, guest.bio, guest.company, guest.role].filter(Boolean).join(" ").toLowerCase().includes(term);
  });

  const distinctTags = Array.from(new Set(allEpisodes.flatMap((episode) => episode.tags))).sort();
  const distinctIndustries = Array.from(new Set(allEpisodes.flatMap((episode) => episode.industries))).sort();

  return {
    episodes: filteredEpisodes,
    guests: filteredGuests,
    filters: {
      guests: allGuests.map((guest) => ({ slug: guest.slug, name: guest.name })),
      tags: distinctTags,
      industries: distinctIndustries
    }
  };
}

function enrichEpisode(episode: MvpEpisode) {
  return {
    ...episode,
    guests: guests.filter((guest) => episode.guestSlugs.includes(guest.slug)).map((guest) => ({ id: guest.id, slug: guest.slug, name: guest.name, company: guest.company })),
    sponsor: sponsors.find((sponsor) => sponsor.slug === episode.sponsorSlug) ?? null,
    surveys: []
  };
}
