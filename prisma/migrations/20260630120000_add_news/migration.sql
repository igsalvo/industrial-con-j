ALTER TABLE "SiteConfig"
ADD COLUMN "showNewsSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showAlumniNewsSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "newsSectionEyebrow" TEXT DEFAULT 'Noticias',
ADD COLUMN "newsSectionTitle" TEXT DEFAULT 'Noticias de la comunidad',
ADD COLUMN "newsSectionDescription" TEXT DEFAULT 'Actualizaciones, hitos y novedades del ecosistema Industrial con J.',
ADD COLUMN "newsSectionOrder" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN "alumniNewsSectionEyebrow" TEXT DEFAULT 'Noticias Alumni',
ADD COLUMN "alumniNewsSectionTitle" TEXT DEFAULT 'Noticias Alumni',
ADD COLUMN "alumniNewsSectionDescription" TEXT DEFAULT 'Novedades y reconocimientos vinculados a alumni de Ingeniería Industrial.',
ADD COLUMN "alumniNewsSectionOrder" INTEGER NOT NULL DEFAULT 8;

CREATE TABLE "NewsItem" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "imageUrl" TEXT,
  "imagePositionX" TEXT NOT NULL DEFAULT 'center',
  "imagePositionY" TEXT NOT NULL DEFAULT 'center',
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "ctaText" TEXT,
  "ctaLink" TEXT,
  "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "order" INTEGER NOT NULL DEFAULT 0,
  "showOnNews" BOOLEAN NOT NULL DEFAULT true,
  "showOnAlumniNews" BOOLEAN NOT NULL DEFAULT false,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsItem_slug_key" ON "NewsItem"("slug");
CREATE INDEX "NewsItem_isVisible_showOnNews_publishedAt_idx" ON "NewsItem"("isVisible", "showOnNews", "publishedAt");
CREATE INDEX "NewsItem_isVisible_showOnAlumniNews_publishedAt_idx" ON "NewsItem"("isVisible", "showOnAlumniNews", "publishedAt");
