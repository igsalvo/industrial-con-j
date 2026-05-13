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
      showDonationsSection: true,
      showSponsorBanner: true,
      sponsorBannerTitle: "Aliados",
      heroEyebrow: "Comunidad industrial en movimiento",
      heroTitle: "Contenido, eventos y comunidad de",
      heroTitleAccent: "Industrial con J",
      heroDescription: "Un espacio para conectar ideas, personas, eventos, alumni, productos e iniciativas del ecosistema industrial.",
      heroPrimaryCtaLabel: "Explorar plataforma",
      heroPrimaryCtaHref: "/podcast",
      heroSecondaryCtaLabel: "Ver eventos",
      heroSecondaryCtaHref: "/events",
      heroImageUrl: null,
      heroVideoUrl: null,
      heroVideoEnabled: false,
      heroOrder: 0,
      featuredClipsEyebrow: "Clips destacados",
      featuredClipsTitle: "Shorts de los capitulos",
      featuredClipsDescription: "Fragmentos cortos para destacar ideas clave y llevar trafico al episodio completo.",
      featuredClipsOrder: 1,
      latestEpisodesEyebrow: "Ultimos episodios",
      latestEpisodesTitle: "Conversaciones aplicadas a operaciones",
      latestEpisodesDescription: "Desde mejora continua hasta transformacion digital, con invitados del mundo industrial.",
      latestEpisodesOrder: 2,
      sponsorsSectionEyebrow: "Aliados",
      sponsorsSectionTitle: "Aliados de Industrial con J",
      sponsorsSectionDescription: "Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial.",
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
      identitySectionEyebrow: "Identidad",
      identitySectionTitle: "Lo que mueve Industrial con J",
      identitySectionDescription: "Proposito, vision, mision y valores editables desde el administrador.",
      identitySectionOrder: 6,
      honorSectionEyebrow: "Alumni",
      honorSectionTitle: "Personas que abren camino",
      honorSectionDescription: "Reconocimientos y perfiles destacados del ecosistema industrial.",
      honorSectionOrder: 7,
      productsSectionEyebrow: "TienDIIta CEIN",
      productsSectionTitle: "Catálogo simple",
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
      communityPageEyebrow: "Comunidad",
      communityPageTitle: "Encuestas, preguntas y contacto",
      communityPageDescription: "Queremos escuchar tus ideas, preguntas y comentarios. Propón temas, recomienda invitados o cuéntanos cómo te gustaría ser parte de esta comunidad.",
      communityEmptyTitle: "No hay encuestas activas",
      communityEmptyDescription: "Pronto abriremos nuevos espacios para que puedas compartir tus ideas, preguntas y opiniones con la comunidad.",
      communityContactTitle: "Contáctanos",
      communityContactDescription: "Deja tu comentario e información de contacto para responderte después.",
      communityContactSubmitLabel: "Enviar comentario",
      donationsContactTitle: "Dejar datos para donar",
      donationsContactDescription: "Déjanos tus datos y cuéntanos cómo te gustaría colaborar. Nos pondremos en contacto contigo para coordinar los próximos pasos.",
      donationsContactSubmitLabel: "Enviar datos",
      episodesPageEyebrow: "Archivo",
      episodesPageTitle: "Todos los episodios",
      episodesPageDescription: "Explora el catalogo completo con lecturas limpias, links externos y relacion entre invitados, tags e industrias.",
      guestsPageEyebrow: "Invitados",
      guestsPageTitle: "Personas que construyen industria",
      guestsPageDescription: "Perfiles, empresas, enlaces sociales y episodios donde participan.",
      sponsorsPageEyebrow: "Aliados",
      sponsorsPageTitle: "Aliados de Industrial con J",
      sponsorsPageDescription: "Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial.",
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

  await Promise.all([
    prisma.identityItem.deleteMany({ where: { title: { in: ["Proposito Industrial con J", "Vision Industrial con J", "Mision Industrial con J", "Valores Industrial con J"] } } }),
    prisma.honorMember.deleteMany({ where: { name: "Comunidad Industrial" } }),
    prisma.event.deleteMany({ where: { title: { in: ["Encuentro comunidad industrial", "Taller de operaciones"] } } }),
    prisma.calendarSource.deleteMany({ where: { calendarIdOrUrl: "vinculacion.dii@uchile.cl" } }),
    prisma.participationItem.deleteMany({ where: { title: { in: ["Donar al proyecto", "Alianzas para episodios", "Sumarse a la comunidad"] } } }),
    prisma.product.deleteMany({ where: { slug: { in: ["polera-industrial-con-j", "sticker-pack-cein"] } } })
  ]);

  await prisma.productCategory.deleteMany({ where: { slug: { in: ["merchandising", "papeleria"] } } });

  await prisma.identityItem.createMany({
    data: [
      { kind: "Proposito", title: "Proposito Industrial con J", text: "Conectar conversaciones industriales con aprendizajes aplicables para estudiantes, egresados y equipos reales.", icon: "purpose", order: 1 },
      { kind: "Vision", title: "Vision Industrial con J", text: "Ser una plataforma reconocida por ordenar ideas, referentes y oportunidades del ecosistema industrial.", icon: "vision", order: 2 },
      { kind: "Mision", title: "Mision Industrial con J", text: "Publicar contenido claro, convocar invitados relevantes y abrir espacios de comunidad administrables.", icon: "mission", order: 3 },
      { kind: "Valores", title: "Valores Industrial con J", text: "Rigor, colaboracion, curiosidad aplicada y respeto por quienes construyen sistemas complejos.", icon: "values", order: 4 }
    ]
  });

  await prisma.honorMember.create({
    data: {
      name: "Comunidad Industrial",
      description: "Perfil inicial para probar Alumni desde el administrador.",
      role: "Reconocimiento",
      generation: "2026",
      externalLinks: [{ label: "LinkedIn", url: "https://www.linkedin.com/company/ingenieria-industrial-uchile/posts/?feedView=all" }],
      order: 1
    }
  });

  const merchandising = await prisma.productCategory.create({
    data: { name: "Merchandising", slug: "merchandising", description: "Productos de identidad del proyecto.", order: 1 }
  });
  const papeleria = await prisma.productCategory.create({
    data: { name: "Papeleria", slug: "papeleria", description: "Material simple para actividades CEIN.", order: 2 }
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Polera Industrial con J",
        slug: "polera-industrial-con-j",
        description: "Producto de muestra para validar catalogo, filtros y CTA.",
        price: 12990,
        stock: 20,
        ctaText: "Consultar",
        ctaLink: "https://www.instagram.com/ingenieriaindustrialuchile/",
        categoryId: merchandising.id,
        order: 1
      },
      {
        name: "Sticker pack CEIN",
        slug: "sticker-pack-cein",
        description: "Pack simple para probar categorias y busqueda.",
        price: 2990,
        stock: 50,
        ctaText: "Consultar",
        ctaLink: "https://www.instagram.com/ingenieriaindustrialuchile/",
        categoryId: papeleria.id,
        order: 2
      }
    ]
  });

  await prisma.calendarSource.create({
    data: {
      name: "Vinculación DII",
      calendarIdOrUrl: "vinculacion.dii@uchile.cl",
      order: 1
    }
  });

  await prisma.participationItem.createMany({
    data: [
      { title: "Donar al proyecto", description: "Apoya la produccion de nuevos episodios y recursos.", type: "DONATION", icon: "donation", ctaText: "Contactar", ctaLink: "/contact", order: 1 },
      { title: "Alianzas para episodios", description: "Conecta tu marca con una audiencia industrial concreta.", type: "SPONSORSHIP", icon: "sponsorship", ctaText: "Conversemos", ctaLink: "/contact", order: 2 },
      { title: "Sumarse a la comunidad", description: "Participa en encuestas, preguntas y futuras actividades.", type: "PARTICIPATION", icon: "participation", ctaText: "Ir a comunidad", ctaLink: "/community", order: 3 }
    ]
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
