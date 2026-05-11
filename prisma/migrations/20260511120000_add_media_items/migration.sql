CREATE TABLE "MediaItem" (
  "id" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "src" TEXT NOT NULL,
  "alt" TEXT NOT NULL,
  "label" TEXT,
  "href" TEXT,
  "positionX" TEXT NOT NULL DEFAULT 'center',
  "positionY" TEXT NOT NULL DEFAULT 'center',
  "order" INTEGER NOT NULL DEFAULT 0,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MediaItem_section_isVisible_order_idx" ON "MediaItem"("section", "isVisible", "order");

ALTER TABLE "SiteConfig" ALTER COLUMN "sponsorBannerTitle" SET DEFAULT 'Aliados';
ALTER TABLE "SiteConfig" ALTER COLUMN "heroTitle" SET DEFAULT 'Ingeniería Industrial se escribe con';
ALTER TABLE "SiteConfig" ALTER COLUMN "heroTitleAccent" SET DEFAULT 'J';
ALTER TABLE "SiteConfig" ALTER COLUMN "heroDescription" SET DEFAULT 'Un espacio para reunir historias, conversaciones, eventos e iniciativas que conectan a la comunidad de Ingeniería Industrial de la Universidad de Chile.';
ALTER TABLE "SiteConfig" ALTER COLUMN "heroPrimaryCtaLabel" SET DEFAULT 'Explorar Industrial con J';
ALTER TABLE "SiteConfig" ALTER COLUMN "sponsorsSectionEyebrow" SET DEFAULT 'Aliados';
ALTER TABLE "SiteConfig" ALTER COLUMN "sponsorsSectionTitle" SET DEFAULT 'Aliados de Industrial con J';
ALTER TABLE "SiteConfig" ALTER COLUMN "sponsorsSectionDescription" SET DEFAULT 'Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial.';
ALTER TABLE "SiteConfig" ALTER COLUMN "productsSectionTitle" SET DEFAULT 'Productos con identidad industrial';
ALTER TABLE "SiteConfig" ALTER COLUMN "productsSectionDescription" SET DEFAULT 'Artículos, recuerdos y productos pensados para quienes quieren llevar consigo parte de la comunidad de Ingeniería Industrial.';
ALTER TABLE "SiteConfig" ALTER COLUMN "communityPageEyebrow" SET DEFAULT 'COMUNIDAD';
ALTER TABLE "SiteConfig" ALTER COLUMN "communityPageTitle" SET DEFAULT 'Participa en Industrial con J';
ALTER TABLE "SiteConfig" ALTER COLUMN "communityPageDescription" SET DEFAULT 'Queremos escuchar tus ideas, preguntas y comentarios. Propón temas, recomienda invitados o cuéntanos cómo te gustaría ser parte de esta comunidad.';
ALTER TABLE "SiteConfig" ALTER COLUMN "communityEmptyTitle" SET DEFAULT 'No hay preguntas activas por ahora';
ALTER TABLE "SiteConfig" ALTER COLUMN "communityEmptyDescription" SET DEFAULT 'Pronto abriremos nuevos espacios para que puedas compartir tus ideas, preguntas y opiniones con la comunidad.';
ALTER TABLE "SiteConfig" ALTER COLUMN "communityContactTitle" SET DEFAULT 'Queremos escucharte';
ALTER TABLE "SiteConfig" ALTER COLUMN "communityContactDescription" SET DEFAULT 'Déjanos tu comentario, idea o propuesta.';
ALTER TABLE "SiteConfig" ALTER COLUMN "communityContactSubmitLabel" SET DEFAULT 'Enviar mensaje';
ALTER TABLE "SiteConfig" ALTER COLUMN "donationsContactTitle" SET DEFAULT 'Donaciones y alianzas';
ALTER TABLE "SiteConfig" ALTER COLUMN "donationsContactDescription" SET DEFAULT 'Déjanos tus datos y cuéntanos cómo te gustaría colaborar. Nos pondremos en contacto contigo para coordinar los próximos pasos.';
ALTER TABLE "SiteConfig" ALTER COLUMN "donationsContactSubmitLabel" SET DEFAULT 'Quiero apoyar';
ALTER TABLE "SiteConfig" ALTER COLUMN "episodesPageEyebrow" SET DEFAULT 'CONTENIDO';
ALTER TABLE "SiteConfig" ALTER COLUMN "episodesPageTitle" SET DEFAULT 'Episodios';
ALTER TABLE "SiteConfig" ALTER COLUMN "episodesPageDescription" SET DEFAULT 'Conversaciones con personas de la comunidad industrial sobre trayectorias, aprendizajes, decisiones y desafíos que conectan la ingeniería con el mundo real.';
ALTER TABLE "SiteConfig" ALTER COLUMN "sponsorsPageEyebrow" SET DEFAULT 'ALIADOS';
ALTER TABLE "SiteConfig" ALTER COLUMN "sponsorsPageTitle" SET DEFAULT 'Aliados de Industrial con J';
ALTER TABLE "SiteConfig" ALTER COLUMN "sponsorsPageDescription" SET DEFAULT 'Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial.';

UPDATE "SiteConfig"
SET
  "sponsorBannerTitle" = CASE WHEN "sponsorBannerTitle" IN ('Auspiciadores', 'Sponsors') THEN 'Aliados' ELSE "sponsorBannerTitle" END,
  "sponsorsSectionEyebrow" = CASE WHEN "sponsorsSectionEyebrow" = 'Sponsors' THEN 'Aliados' ELSE "sponsorsSectionEyebrow" END,
  "sponsorsPageEyebrow" = CASE WHEN "sponsorsPageEyebrow" = 'Sponsors' THEN 'ALIADOS' ELSE "sponsorsPageEyebrow" END,
  "productsSectionDescription" = CASE WHEN "productsSectionDescription" = 'Productos administrables para consultar o reservar sin carrito ni pagos.' THEN 'Artículos, recuerdos y productos pensados para quienes quieren llevar consigo parte de la comunidad de Ingeniería Industrial.' ELSE "productsSectionDescription" END,
  "communityPageDescription" = CASE WHEN "communityPageDescription" LIKE '%bandeja del administrador%' THEN 'Queremos escuchar tus ideas, preguntas y comentarios. Propón temas, recomienda invitados o cuéntanos cómo te gustaría ser parte de esta comunidad.' ELSE "communityPageDescription" END,
  "communityEmptyDescription" = CASE WHEN "communityEmptyDescription" LIKE 'Publica una encuesta%' THEN 'Pronto abriremos nuevos espacios para que puedas compartir tus ideas, preguntas y opiniones con la comunidad.' ELSE "communityEmptyDescription" END,
  "donationsContactDescription" = CASE WHEN "donationsContactDescription" LIKE '%bandeja del administrador%' THEN 'Déjanos tus datos y cuéntanos cómo te gustaría colaborar. Nos pondremos en contacto contigo para coordinar los próximos pasos.' ELSE "donationsContactDescription" END;
