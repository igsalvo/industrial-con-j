import { NextResponse } from "next/server";
import { ensureAdminApiSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

function toNullableString(value: unknown) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || null;
}

function toNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export async function PATCH(request: Request) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const payload = (await request.json()) as Record<string, unknown>;

  const siteConfigData = {
    logoUrl: toNullableString(payload.logoUrl),
    showFeaturedClips: payload.showFeaturedClips === true,
    showLatestEpisodes: payload.showLatestEpisodes === true,
    showSponsorsSection: payload.showSponsorsSection === true,
    showRecommendedSection: false,
    showGuestsSection: payload.showGuestsSection === true,
    showCommunityLink: payload.showCommunityLink === true,
    showDonationsSection: payload.showDonationsSection === true,
    showSponsorBanner: payload.showSponsorBanner === true,
    sponsorBannerTitle: toNullableString(payload.sponsorBannerTitle) || "Auspiciadores",
    heroEyebrow: toNullableString(payload.heroEyebrow),
    heroTitle: toNullableString(payload.heroTitle),
    heroTitleAccent: toNullableString(payload.heroTitleAccent),
    heroDescription: toNullableString(payload.heroDescription),
    heroPrimaryCtaLabel: toNullableString(payload.heroPrimaryCtaLabel),
    heroPrimaryCtaHref: toNullableString(payload.heroPrimaryCtaHref),
    heroSecondaryCtaLabel: toNullableString(payload.heroSecondaryCtaLabel),
    heroSecondaryCtaHref: toNullableString(payload.heroSecondaryCtaHref),
    featuredClipsEyebrow: toNullableString(payload.featuredClipsEyebrow),
    featuredClipsTitle: toNullableString(payload.featuredClipsTitle),
    featuredClipsDescription: toNullableString(payload.featuredClipsDescription),
    featuredClipsOrder: toNumber(payload.featuredClipsOrder, 1),
    latestEpisodesEyebrow: toNullableString(payload.latestEpisodesEyebrow),
    latestEpisodesTitle: toNullableString(payload.latestEpisodesTitle),
    latestEpisodesDescription: toNullableString(payload.latestEpisodesDescription),
    latestEpisodesOrder: toNumber(payload.latestEpisodesOrder, 2),
    sponsorsSectionEyebrow: toNullableString(payload.sponsorsSectionEyebrow),
    sponsorsSectionTitle: toNullableString(payload.sponsorsSectionTitle),
    sponsorsSectionDescription: toNullableString(payload.sponsorsSectionDescription),
    sponsorsSectionOrder: toNumber(payload.sponsorsSectionOrder, 3),
    donationsSectionEyebrow: toNullableString(payload.donationsSectionEyebrow),
    donationsSectionTitle: toNullableString(payload.donationsSectionTitle),
    donationsSectionDescription: toNullableString(payload.donationsSectionDescription),
    donationsSectionOrder: toNumber(payload.donationsSectionOrder, 4),
    donationUrl: toNullableString(payload.donationUrl),
    guestsSectionEyebrow: toNullableString(payload.guestsSectionEyebrow),
    guestsSectionTitle: toNullableString(payload.guestsSectionTitle),
    guestsSectionDescription: toNullableString(payload.guestsSectionDescription),
    guestsSectionOrder: toNumber(payload.guestsSectionOrder, 5),
    communityPageEyebrow: toNullableString(payload.communityPageEyebrow),
    communityPageTitle: toNullableString(payload.communityPageTitle),
    communityPageDescription: toNullableString(payload.communityPageDescription),
    communityEmptyTitle: toNullableString(payload.communityEmptyTitle),
    communityEmptyDescription: toNullableString(payload.communityEmptyDescription),
    communityContactTitle: toNullableString(payload.communityContactTitle),
    communityContactDescription: toNullableString(payload.communityContactDescription),
    communityContactSubmitLabel: toNullableString(payload.communityContactSubmitLabel),
    donationsContactTitle: toNullableString(payload.donationsContactTitle),
    donationsContactDescription: toNullableString(payload.donationsContactDescription),
    donationsContactSubmitLabel: toNullableString(payload.donationsContactSubmitLabel),
    episodesPageEyebrow: toNullableString(payload.episodesPageEyebrow),
    episodesPageTitle: toNullableString(payload.episodesPageTitle),
    episodesPageDescription: toNullableString(payload.episodesPageDescription),
    guestsPageEyebrow: toNullableString(payload.guestsPageEyebrow),
    guestsPageTitle: toNullableString(payload.guestsPageTitle),
    guestsPageDescription: toNullableString(payload.guestsPageDescription),
    sponsorsPageEyebrow: toNullableString(payload.sponsorsPageEyebrow),
    sponsorsPageTitle: toNullableString(payload.sponsorsPageTitle),
    sponsorsPageDescription: toNullableString(payload.sponsorsPageDescription),
    footerTitle: toNullableString(payload.footerTitle),
    footerDescription: toNullableString(payload.footerDescription)
  };

  const config = await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: siteConfigData,
    create: {
      id: "default",
      ...siteConfigData
    }
  });

  return NextResponse.json(config);
}
