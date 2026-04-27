-- CreateTable
CREATE TABLE "public"."SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "showFeaturedClips" BOOLEAN NOT NULL DEFAULT true,
    "showLatestEpisodes" BOOLEAN NOT NULL DEFAULT true,
    "showSponsorsSection" BOOLEAN NOT NULL DEFAULT true,
    "showRecommendedSection" BOOLEAN NOT NULL DEFAULT true,
    "showGuestsSection" BOOLEAN NOT NULL DEFAULT true,
    "showCommunityLink" BOOLEAN NOT NULL DEFAULT true,
    "showSponsorBanner" BOOLEAN NOT NULL DEFAULT true,
    "sponsorBannerTitle" TEXT DEFAULT 'Auspiciadores',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);
