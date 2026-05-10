ALTER TABLE "SiteConfig" ADD COLUMN "heroVideoUrl" TEXT;
ALTER TABLE "SiteConfig" ADD COLUMN "heroVideoEnabled" BOOLEAN NOT NULL DEFAULT false;
