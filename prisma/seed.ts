import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

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

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
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
      heroSecondaryCtaHref: "/community"
    }
  });

  const sampleSponsorSlug = "planta-digital";
  const sampleGuestSlug = "camila-rojas";
  const sampleEpisodeSlug = "ingenieria-industrial-y-transformacion-digital";
  const sampleSurveySlug = "encuesta-transformacion-digital";
  await prisma.survey.deleteMany({
    where: {
      slug: {
        in: [sampleSurveySlug]
      }
    }
  });

  await prisma.episode.deleteMany({
    where: {
      slug: {
        in: [sampleEpisodeSlug]
      }
    }
  });

  await prisma.guest.deleteMany({
    where: {
      slug: {
        in: [sampleGuestSlug]
      }
    }
  });

  await prisma.sponsor.deleteMany({
    where: {
      slug: {
        in: [sampleSponsorSlug]
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
