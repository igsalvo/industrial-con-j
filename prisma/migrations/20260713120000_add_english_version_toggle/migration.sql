ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "showEnglishVersion" BOOLEAN NOT NULL DEFAULT false;

UPDATE "SiteConfig"
SET "showEnglishVersion" = false;
