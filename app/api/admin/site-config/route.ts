import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

function isValidHeroVideoUrl(value: string | null) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/")) {
    return /\.mp4(?:\?.*)?$/i.test(value);
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && /\.mp4$/i.test(url.pathname);
  } catch {
    return false;
  }
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
  const heroVideoUrl = toNullableString(payload.heroVideoUrl);
  const heroVideoEnabled = payload.heroVideoEnabled === true;

  if (heroVideoEnabled && !isValidHeroVideoUrl(heroVideoUrl)) {
    return NextResponse.json({ error: "La URL del video debe ser un enlace público HTTPS o local terminado en .mp4." }, { status: 400 });
  }

  const siteConfigData = {
    logoUrl: toNullableString(payload.logoUrl),
    showPodcastSection: payload.showPodcastSection === true,
    showHeroSection: payload.showHeroSection === true,
    showFeaturedClips: payload.showFeaturedClips === true,
    showLatestEpisodes: payload.showLatestEpisodes === true,
    showSponsorsSection: payload.showSponsorsSection === true,
    showRecommendedSection: false,
    showGuestsSection: payload.showGuestsSection === true,
    showIdentitySection: payload.showIdentitySection === true,
    showHonorSection: payload.showHonorSection === true,
    showProductsSection: payload.showProductsSection === true,
    showEventsSection: payload.showEventsSection === true,
    showParticipationSection: payload.showParticipationSection === true,
    showCommunityLink: payload.showCommunityLink === true,
    showContactLink: payload.showContactLink === true,
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
    heroImageUrl: toNullableString(payload.heroImageUrl),
    heroVideoUrl,
    heroVideoEnabled,
    heroOrder: toNumber(payload.heroOrder, 0),
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
    identitySectionEyebrow: toNullableString(payload.identitySectionEyebrow),
    identitySectionTitle: toNullableString(payload.identitySectionTitle),
    identitySectionDescription: toNullableString(payload.identitySectionDescription),
    identitySectionOrder: toNumber(payload.identitySectionOrder, 6),
    honorSectionEyebrow: toNullableString(payload.honorSectionEyebrow),
    honorSectionTitle: toNullableString(payload.honorSectionTitle),
    honorSectionDescription: toNullableString(payload.honorSectionDescription),
    honorSectionOrder: toNumber(payload.honorSectionOrder, 7),
    productsSectionEyebrow: toNullableString(payload.productsSectionEyebrow),
    productsSectionTitle: toNullableString(payload.productsSectionTitle),
    productsSectionDescription: toNullableString(payload.productsSectionDescription),
    productsSectionOrder: toNumber(payload.productsSectionOrder, 8),
    eventsSectionEyebrow: toNullableString(payload.eventsSectionEyebrow),
    eventsSectionTitle: toNullableString(payload.eventsSectionTitle),
    eventsSectionDescription: toNullableString(payload.eventsSectionDescription),
    eventsSectionOrder: toNumber(payload.eventsSectionOrder, 9),
    participationSectionEyebrow: toNullableString(payload.participationSectionEyebrow),
    participationSectionTitle: toNullableString(payload.participationSectionTitle),
    participationSectionDescription: toNullableString(payload.participationSectionDescription),
    participationSectionOrder: toNumber(payload.participationSectionOrder, 10),
    contactPageEyebrow: toNullableString(payload.contactPageEyebrow),
    contactPageTitle: toNullableString(payload.contactPageTitle),
    contactPageDescription: toNullableString(payload.contactPageDescription),
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

  revalidatePath("/", "layout");
  revalidatePath("/admin");

  return NextResponse.json(config);
}
