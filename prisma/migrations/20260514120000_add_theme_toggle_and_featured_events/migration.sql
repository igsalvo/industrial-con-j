ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "showThemeToggle" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "Event_isVisible_isFeatured_startsAt_idx" ON "Event"("isVisible", "isFeatured", "startsAt");
