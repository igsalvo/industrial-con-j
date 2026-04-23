import bcrypt from "bcrypt";
import { PrismaClient, QuestionType, SurveyKind, SurveyStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required for seeding.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash
    }
  });

  const sponsor = await prisma.sponsor.upsert({
    where: { slug: "planta-digital" },
    update: {},
    create: {
      slug: "planta-digital",
      name: "Planta Digital",
      websiteUrl: "https://example.com",
      description: "Plataforma de analitica operacional para equipos industriales.",
      tier: "Gold",
      isFeatured: true,
      logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
    }
  });

  const guest = await prisma.guest.upsert({
    where: { slug: "camila-rojas" },
    update: {},
    create: {
      slug: "camila-rojas",
      name: "Camila Rojas",
      bio: "Ingeniera industrial enfocada en transformacion digital, mantenimiento predictivo y liderazgo de operaciones.",
      company: "Andes Manufacturing",
      role: "Head of Operations",
      industries: ["Manufacturing", "Mining"],
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        linkedin: "https://linkedin.com",
        x: "https://x.com"
      }
    }
  });

  const episode = await prisma.episode.upsert({
    where: { slug: "ingenieria-industrial-y-transformacion-digital" },
    update: {},
    create: {
      slug: "ingenieria-industrial-y-transformacion-digital",
      title: "Ingenieria Industrial y Transformacion Digital",
      shortDescription: "Como pasar de eficiencias marginales a una operacion guiada por datos.",
      longDescription:
        "Conversacion profunda sobre indicadores, decisiones de planta, automatizacion pragmatica y la cultura operativa necesaria para escalar mejoras continuas.",
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
      audioEmbedUrl: "https://open.spotify.com/embed/episode/sample",
      clipThumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      clipVideoUrl: "https://youtube.com/shorts/example",
      resourceLinks: [
        { label: "Checklist de madurez digital", url: "https://example.com/checklist.pdf" },
        { label: "Plantilla de KPI", url: "https://example.com/kpi.xlsx" }
      ],
      tags: ["Transformacion Digital", "Lean", "KPI"],
      industries: ["Manufacturing", "Logistics"],
      isFeatured: true,
      sponsorId: sponsor.id,
      guests: {
        connect: [{ id: guest.id }]
      }
    }
  });

  await prisma.survey.upsert({
    where: { slug: "encuesta-transformacion-digital" },
    update: {},
    create: {
      slug: "encuesta-transformacion-digital",
      title: "Encuesta del episodio",
      description: "Queremos entender en que etapa de digitalizacion esta tu operacion.",
      kind: SurveyKind.SURVEY,
      status: SurveyStatus.PUBLISHED,
      episodeId: episode.id,
      successCopy: "Gracias por responder. Usaremos esto para mejorar los proximos episodios.",
      questions: {
        create: [
          {
            label: "En que industria trabajas?",
            type: QuestionType.SINGLE_CHOICE,
            position: 1,
            options: ["Manufacturing", "Mining", "Logistics", "Other"]
          },
          {
            label: "Cual es hoy tu principal cuello de botella?",
            type: QuestionType.LONG_TEXT,
            position: 2,
            options: []
          },
          {
            label: "Te gustaria participar en un sorteo de libros?",
            type: QuestionType.SINGLE_CHOICE,
            position: 3,
            options: ["Si", "No"]
          },
          {
            label: "Dejanos tu email para el sorteo",
            type: QuestionType.EMAIL,
            position: 4,
            options: [],
            isRequired: false
          }
        ]
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
