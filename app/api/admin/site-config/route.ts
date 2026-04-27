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
      sponsorBannerTitle: payload.sponsorBannerTitle || "Auspiciadores"
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
      sponsorBannerTitle: payload.sponsorBannerTitle || "Auspiciadores"
    }
  });

  return NextResponse.json(config);
}
