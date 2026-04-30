CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'CONTACT',
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "company" TEXT,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ContactMessage_type_createdAt_idx" ON "ContactMessage"("type", "createdAt");

ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "showDonationsSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "donationsSectionEyebrow" TEXT DEFAULT 'Donaciones';
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "donationsSectionTitle" TEXT DEFAULT 'Apoya nuevas conversaciones industriales';
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "donationsSectionDescription" TEXT DEFAULT 'Deja tus datos para coordinar una donacion, alianza o apoyo al proyecto.';
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "donationsSectionOrder" INTEGER NOT NULL DEFAULT 4;
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "donationUrl" TEXT;

