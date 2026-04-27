-- AlterTable
ALTER TABLE "public"."SiteConfig"
ADD COLUMN "heroDescription" TEXT DEFAULT 'Episodios, clips, invitados, encuestas y oportunidades para marcas que quieren hablarle a lideres de operaciones.',
ADD COLUMN "heroEyebrow" TEXT DEFAULT 'Ingenieria industrial para equipos que ejecutan',
ADD COLUMN "heroPrimaryCtaHref" TEXT DEFAULT '/episodes',
ADD COLUMN "heroPrimaryCtaLabel" TEXT DEFAULT 'Explorar episodios',
ADD COLUMN "heroSecondaryCtaHref" TEXT DEFAULT '/community',
ADD COLUMN "heroSecondaryCtaLabel" TEXT DEFAULT 'Participar en la comunidad',
ADD COLUMN "heroTitle" TEXT DEFAULT 'El hub de contenido, comunidad y patrocinio de',
ADD COLUMN "heroTitleAccent" TEXT DEFAULT 'Industrial con J';
