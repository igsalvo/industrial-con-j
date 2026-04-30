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
      logoUrl: null,
      showFeaturedClips: true,
      showLatestEpisodes: true,
      showSponsorsSection: true,
      showRecommendedSection: false,
      showGuestsSection: true,
      showCommunityLink: true,
      showDonationsSection: true,
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
      donationsSectionEyebrow: "Donaciones",
      donationsSectionTitle: "Apoya nuevas conversaciones industriales",
      donationsSectionDescription: "Deja tus datos para coordinar una donacion, alianza o apoyo al proyecto.",
      donationsSectionOrder: 4,
      donationUrl: null,
      recommendedSectionEyebrow: "Recomendados",
      recommendedSectionTitle: "Episodios que merecen otra escucha",
      recommendedSectionDescription: "Selecciones editoriales para facilitar descubrimiento y aumentar tiempo de sesion.",
      recommendedSectionOrder: 4,
      guestsSectionEyebrow: "Invitados",
      guestsSectionTitle: "Voces del ecosistema industrial",
      guestsSectionDescription: "Expertos, operadores y lideres que aterrizan teoria en ejecucion.",
      guestsSectionOrder: 6,
      communityPageEyebrow: "Comunidad",
      communityPageTitle: "Encuestas, preguntas y contacto",
      communityPageDescription: "Participa en preguntas generales o asociadas a capitulos especificos. Los comentarios quedan en la bandeja del administrador.",
      communityEmptyTitle: "No hay encuestas activas",
      communityEmptyDescription: "Publica una encuesta desde el administrador para mostrarla aqui.",
      communityContactTitle: "Contactanos",
      communityContactDescription: "Deja tu comentario e informacion de contacto para responderte despues.",
      communityContactSubmitLabel: "Enviar comentario",
      donationsContactTitle: "Dejar datos para donar",
      donationsContactDescription: "Completa el formulario y quedara en la bandeja del administrador para responderte.",
      donationsContactSubmitLabel: "Enviar datos",
      episodesPageEyebrow: "Archivo",
      episodesPageTitle: "Todos los episodios",
      episodesPageDescription: "Explora el catalogo completo con lecturas limpias, links externos y relacion entre invitados, tags e industrias.",
      guestsPageEyebrow: "Invitados",
      guestsPageTitle: "Personas que construyen industria",
      guestsPageDescription: "Perfiles, empresas, enlaces sociales y episodios donde participan.",
      sponsorsPageEyebrow: "Sponsors",
      sponsorsPageTitle: "Aliados comerciales del podcast",
      sponsorsPageDescription: "Grid de logos, links de salida y sponsor destacado por episodio.",
      footerTitle: "Industrial con J",
      footerDescription: "Contenido para lideres de operaciones, ingenieria industrial y equipos que quieren escalar sistemas reales."
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
