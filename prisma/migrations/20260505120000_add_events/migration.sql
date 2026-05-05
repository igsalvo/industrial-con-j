-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN "showEventsSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "eventsSectionEyebrow" TEXT DEFAULT 'Eventos',
ADD COLUMN "eventsSectionTitle" TEXT DEFAULT 'Próximas actividades',
ADD COLUMN "eventsSectionDescription" TEXT DEFAULT 'Calendario de encuentros, hitos y actividades abiertas para la comunidad.',
ADD COLUMN "eventsSectionOrder" INTEGER NOT NULL DEFAULT 9;

-- CreateTable
CREATE TABLE "Event" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3),
  "location" TEXT,
  "imageUrl" TEXT,
  "type" TEXT,
  "ctaText" TEXT,
  "ctaLink" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_isVisible_startsAt_idx" ON "Event"("isVisible", "startsAt");
CREATE INDEX "Event_startsAt_idx" ON "Event"("startsAt");

-- Update existing default home copy when it still has the old podcast-only wording.
UPDATE "SiteConfig"
SET
  "heroEyebrow" = 'Comunidad industrial en movimiento',
  "heroTitle" = 'Contenido, eventos y comunidad de',
  "heroDescription" = 'Un espacio para conectar ideas, personas, eventos, alumni, productos e iniciativas del ecosistema industrial.',
  "heroPrimaryCtaLabel" = 'Explorar plataforma',
  "heroPrimaryCtaHref" = '/podcast',
  "heroSecondaryCtaLabel" = 'Ver eventos',
  "heroSecondaryCtaHref" = '/events'
WHERE "id" = 'default'
  AND ("heroTitle" IS NULL OR "heroTitle" = 'El hub de contenido, comunidad y patrocinio de');

UPDATE "SiteConfig"
SET "contactPageDescription" = '¿Tienes una idea, propuesta o quieres ser parte? Escríbenos y conversemos.'
WHERE "id" = 'default'
  AND (
    "contactPageDescription" IS NULL
    OR "contactPageDescription" = 'Escribenos y revisaremos tu mensaje desde el panel administrador.'
    OR "contactPageDescription" = 'Deja tus datos y un comentario. El equipo lo revisara desde el panel administrador.'
  );

UPDATE "SiteConfig"
SET
  "honorSectionEyebrow" = 'Alumni',
  "productsSectionTitle" = 'Catálogo simple',
  "contactPageTitle" = 'Contáctanos',
  "communityContactTitle" = 'Contáctanos',
  "communityContactDescription" = 'Deja tu comentario e información de contacto para responderte después.'
WHERE "id" = 'default';
