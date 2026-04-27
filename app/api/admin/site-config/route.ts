import { NextResponse } from "next/server";
import { ensureAdminApiSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const payload = (await request.json()) as {
    showFeaturedClips: boolean;
    showLatestEpisodes: boolean;
    showSponsorsSection: boolean;
    showRecommendedSection: boolean;
    showGuestsSection: boolean;
    showCommunityLink: boolean;
    showSponsorBanner: boolean;
    sponsorBannerTitle?: string;
    heroEyebrow?: string;
    heroTitle?: string;
    heroTitleAccent?: string;
    heroDescription?: string;
    heroPrimaryCtaLabel?: string;
    heroPrimaryCtaHref?: string;
    heroSecondaryCtaLabel?: string;
    heroSecondaryCtaHref?: string;
  };

  const config = await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {
      showFeaturedClips: payload.showFeaturedClips,
      showLatestEpisodes: payload.showLatestEpisodes,
      showSponsorsSection: payload.showSponsorsSection,
      showRecommendedSection: payload.showRecommendedSection,
      showGuestsSection: payload.showGuestsSection,
      showCommunityLink: payload.showCommunityLink,
      showSponsorBanner: payload.showSponsorBanner,
      sponsorBannerTitle: payload.sponsorBannerTitle || "Auspiciadores",
      heroEyebrow: payload.heroEyebrow || null,
      heroTitle: payload.heroTitle || null,
      heroTitleAccent: payload.heroTitleAccent || null,
      heroDescription: payload.heroDescription || null,
      heroPrimaryCtaLabel: payload.heroPrimaryCtaLabel || null,
      heroPrimaryCtaHref: payload.heroPrimaryCtaHref || null,
      heroSecondaryCtaLabel: payload.heroSecondaryCtaLabel || null,
      heroSecondaryCtaHref: payload.heroSecondaryCtaHref || null
    },
    create: {
      id: "default",
      showFeaturedClips: payload.showFeaturedClips,
      showLatestEpisodes: payload.showLatestEpisodes,
      showSponsorsSection: payload.showSponsorsSection,
      showRecommendedSection: payload.showRecommendedSection,
      showGuestsSection: payload.showGuestsSection,
      showCommunityLink: payload.showCommunityLink,
      showSponsorBanner: payload.showSponsorBanner,
      sponsorBannerTitle: payload.sponsorBannerTitle || "Auspiciadores",
      heroEyebrow: payload.heroEyebrow || null,
      heroTitle: payload.heroTitle || null,
      heroTitleAccent: payload.heroTitleAccent || null,
      heroDescription: payload.heroDescription || null,
      heroPrimaryCtaLabel: payload.heroPrimaryCtaLabel || null,
      heroPrimaryCtaHref: payload.heroPrimaryCtaHref || null,
      heroSecondaryCtaLabel: payload.heroSecondaryCtaLabel || null,
      heroSecondaryCtaHref: payload.heroSecondaryCtaHref || null
    }
  });

  return NextResponse.json(config);
}
