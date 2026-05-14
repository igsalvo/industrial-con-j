import { z } from "zod";
import { parseChileDateTimeLocal } from "@/lib/date-time";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { normalizeList, slugify } from "@/lib/utils";

export const QuestionType = {
  SHORT_TEXT: "SHORT_TEXT",
  LONG_TEXT: "LONG_TEXT",
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  EMAIL: "EMAIL"
} as const;

export const SurveyKind = {
  SURVEY: "SURVEY",
  CONTEST: "CONTEST"
} as const;

export const SurveyStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED"
} as const;

const optionalUrl = z
  .string()
  .trim()
  .url("Ingresa una URL valida.")
  .or(z.literal(""))
  .optional()
  .transform((value) => value || undefined);

const percentageNumber = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().int().min(0).max(100).default(50)
);

const objectPositionX = z.preprocess((value) => (value === "" || value === null ? undefined : value), z.enum(["left", "center", "right"]).default("center"));
const objectPositionY = z.preprocess((value) => (value === "" || value === null ? undefined : value), z.enum(["top", "center", "bottom"]).default("center"));

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(6, "La clave debe tener al menos 6 caracteres.")
});

export const guestInputSchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  bio: z.string(),
  company: z.string().optional(),
  role: z.string().optional(),
  profileImage: optionalUrl,
  profilePositionX: objectPositionX,
  profilePositionY: objectPositionY,
  industries: z.string().optional(),
  linkedin: optionalUrl,
  x: optionalUrl,
  website: optionalUrl,
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true)
});

export const sponsorInputSchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  websiteUrl: z.string().url(),
  logoUrl: optionalUrl,
  description: z.string().optional(),
  tier: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true)
});

export const episodeInputSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  shortDescription: z.string(),
  longDescription: z.string(),
  timestamps: z.string().optional(),
  spotifyUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  applePodcastsUrl: optionalUrl,
  videoEmbedUrl: optionalUrl,
  audioEmbedUrl: optionalUrl,
  thumbnailUrl: optionalUrl,
  thumbnailPositionX: objectPositionX,
  thumbnailPositionY: objectPositionY,
  clipThumbnailUrl: optionalUrl,
  clipVideoUrl: optionalUrl,
  tags: z.string().optional(),
  industries: z.string().optional(),
  resourceLinks: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url()
      })
    )
    .default([]),
  guestIds: z.array(z.string()).default([]),
  sponsorId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  publishedAt: z.string().optional()
});

export const surveyQuestionInputSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  type: z.nativeEnum(QuestionType),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  position: z.number().int().positive(),
  isRequired: z.boolean().default(true),
  options: z.array(z.string()).default([]),
  conditionQuestionId: z.string().optional(),
  conditionValue: z.string().optional()
});

export const surveyInputSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  kind: z.nativeEnum(SurveyKind).default(SurveyKind.SURVEY),
  status: z.nativeEnum(SurveyStatus).default(SurveyStatus.DRAFT),
  successCopy: z.string().optional(),
  episodeId: z.string().optional(),
  questions: z.array(surveyQuestionInputSchema).min(1)
});

export const surveyResponseSchema = z.object({
  surveyId: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  fingerprint: z.string().min(8),
  answers: z.array(
    z.object({
      questionId: z.string(),
      value: z.string().min(1)
    })
  )
});

export const contactMessageSchema = z.object({
  type: z.enum(["CONTACT", "DONATION", "SPONSORSHIP", "PARTICIPATION"]).default("CONTACT"),
  name: z.string().trim().min(1, "Ingresa tu nombre."),
  email: z.string().trim().email("Ingresa un correo válido."),
  subject: z.string().trim().optional().or(z.literal("")),
  motive: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(1, "Ingresa un mensaje.")
});

export const identityItemInputSchema = z.object({
  kind: z.string().trim().min(1),
  title: z.string().trim().min(1),
  text: z.string().trim().min(1),
  icon: z.string().trim().optional().or(z.literal("")),
  imageUrl: optionalUrl,
  order: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true)
});

export const honorMemberInputSchema = z.object({
  name: z.string().trim().min(1),
  photoUrl: optionalUrl,
  photoPositionX: percentageNumber,
  photoPositionY: percentageNumber,
  description: z.string().trim().min(1),
  role: z.string().trim().optional().or(z.literal("")),
  generation: z.string().trim().optional().or(z.literal("")),
  externalLinks: z.array(z.object({ label: z.string().min(1), url: z.string().url() })).default([]),
  order: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true)
});

export const productCategoryInputSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true)
});

export const productInputSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional().or(z.literal("")),
  photoUrl: optionalUrl,
  photoUrls: z.array(z.string().trim().url("Ingresa una URL valida.")).default([]),
  photoPositionX: objectPositionX,
  photoPositionY: objectPositionY,
  description: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  categoryId: z.string().trim().min(1),
  ctaLink: optionalUrl,
  order: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true)
});

export const calendarSourceInputSchema = z.object({
  name: z.string().trim().min(1),
  calendarIdOrUrl: z.string().trim().min(1),
  logoUrl: optionalUrl,
  order: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true)
});

export const participationItemInputSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  imageUrl: optionalUrl,
  icon: z.string().trim().optional().or(z.literal("")),
  type: z.enum(["DONATION", "SPONSORSHIP", "PARTICIPATION"]),
  ctaText: z.string().trim().optional().or(z.literal("")),
  ctaLink: optionalUrl,
  order: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true)
});

export const eventInputSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  startsAt: z.string().trim().min(1),
  endsAt: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  imageUrl: optionalUrl,
  imagePositionX: objectPositionX,
  imagePositionY: objectPositionY,
  sourceName: z.string().trim().optional().or(z.literal("")),
  sourceLogoUrl: optionalUrl,
  sourceCalendarUrl: z.string().trim().optional().or(z.literal("")),
  type: z.string().trim().optional().or(z.literal("")),
  ctaText: z.string().trim().optional().or(z.literal("")),
  ctaLink: optionalUrl,
  order: z.coerce.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true)
});

export const mediaItemInputSchema = z.object({
  section: z.string().trim().min(1),
  src: z.string().trim().min(1, "Sube una imagen o pega una URL."),
  alt: z.string().trim().min(1),
  label: z.string().trim().optional().or(z.literal("")),
  href: optionalUrl,
  positionX: objectPositionX,
  positionY: objectPositionY,
  order: z.coerce.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true)
});

export function toGuestPayload(input: z.infer<typeof guestInputSchema>) {
  return {
    name: input.name,
    slug: input.slug?.trim() || slugify(input.name),
    bio: input.bio,
    company: input.company || undefined,
    role: input.role || undefined,
    profileImage: input.profileImage,
    profilePositionX: input.profilePositionX,
    profilePositionY: input.profilePositionY,
    industries: normalizeList(input.industries || ""),
    isVisible: input.isVisible,
    socialLinks: {
      linkedin: input.linkedin,
      x: input.x,
      website: input.website,
      isFeatured: input.isFeatured
    }
  };
}

export function toSponsorPayload(input: z.infer<typeof sponsorInputSchema>) {
  return {
    name: input.name,
    slug: input.slug?.trim() || slugify(input.name),
    websiteUrl: input.websiteUrl,
    logoUrl: input.logoUrl,
    description: input.description || undefined,
    tier: input.tier || undefined,
    isFeatured: input.isFeatured,
    isVisible: input.isVisible
  };
}

export function toEpisodePayload(input: z.infer<typeof episodeInputSchema>) {
  const resolvedVideoEmbedUrl = input.videoEmbedUrl || getYouTubeEmbedUrl(input.youtubeUrl) || undefined;

  return {
    title: input.title,
    slug: input.slug?.trim() || slugify(input.title),
    shortDescription: input.shortDescription,
    longDescription: input.longDescription,
    timestamps: normalizeList(input.timestamps || ""),
    spotifyUrl: input.spotifyUrl,
    youtubeUrl: input.youtubeUrl,
    applePodcastsUrl: input.applePodcastsUrl,
    videoEmbedUrl: resolvedVideoEmbedUrl,
    audioEmbedUrl: input.audioEmbedUrl,
    thumbnailUrl: input.thumbnailUrl,
    thumbnailPositionX: input.thumbnailPositionX,
    thumbnailPositionY: input.thumbnailPositionY,
    clipThumbnailUrl: input.clipThumbnailUrl,
    clipVideoUrl: input.clipVideoUrl,
    tags: normalizeList(input.tags || ""),
    industries: normalizeList(input.industries || ""),
    resourceLinks: input.resourceLinks,
    sponsorId: input.sponsorId || undefined,
    isFeatured: input.isFeatured,
    isVisible: input.isVisible,
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
    guestIds: input.guestIds
  };
}

export function toIdentityItemPayload(input: z.infer<typeof identityItemInputSchema>) {
  return {
    kind: input.kind,
    title: input.title,
    text: input.text,
    icon: input.icon || undefined,
    imageUrl: input.imageUrl,
    order: input.order,
    isVisible: input.isVisible
  };
}

export function toHonorMemberPayload(input: z.infer<typeof honorMemberInputSchema>) {
  return {
    name: input.name,
    photoUrl: input.photoUrl,
    photoPositionX: input.photoPositionX,
    photoPositionY: input.photoPositionY,
    description: input.description,
    role: input.role || undefined,
    generation: input.generation || undefined,
    externalLinks: input.externalLinks,
    order: input.order,
    isVisible: input.isVisible
  };
}

export function toProductCategoryPayload(input: z.infer<typeof productCategoryInputSchema>) {
  return {
    name: input.name,
    slug: input.slug?.trim() || slugify(input.name),
    description: input.description || undefined,
    order: input.order,
    isVisible: input.isVisible
  };
}

export function toProductPayload(input: z.infer<typeof productInputSchema>) {
  return {
    name: input.name,
    slug: input.slug?.trim() || slugify(input.name),
    photoUrl: input.photoUrl,
    photoUrls: input.photoUrls,
    photoPositionX: input.photoPositionX,
    photoPositionY: input.photoPositionY,
    description: input.description,
    price: input.price,
    categoryId: input.categoryId,
    ctaText: "Consultar",
    ctaLink: input.ctaLink,
    order: input.order,
    isVisible: input.isVisible
  };
}

export function toCalendarSourcePayload(input: z.infer<typeof calendarSourceInputSchema>) {
  return {
    name: input.name,
    calendarIdOrUrl: input.calendarIdOrUrl,
    logoUrl: input.logoUrl,
    order: input.order,
    isVisible: input.isVisible
  };
}

export function toParticipationItemPayload(input: z.infer<typeof participationItemInputSchema>) {
  return {
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl,
    icon: input.icon || undefined,
    type: input.type,
    ctaText: input.ctaText || undefined,
    ctaLink: input.ctaLink,
    order: input.order,
    isVisible: input.isVisible
  };
}

export function toEventPayload(input: z.infer<typeof eventInputSchema>) {
  return {
    title: input.title,
    description: input.description,
    startsAt: parseChileDateTimeLocal(input.startsAt),
    endsAt: input.endsAt ? parseChileDateTimeLocal(input.endsAt) : undefined,
    location: input.location || undefined,
    imageUrl: input.imageUrl,
    imagePositionX: input.imagePositionX,
    imagePositionY: input.imagePositionY,
    sourceName: input.sourceName || undefined,
    sourceLogoUrl: input.sourceLogoUrl,
    sourceCalendarUrl: input.sourceCalendarUrl || undefined,
    type: input.type || undefined,
    ctaText: input.ctaText || undefined,
    ctaLink: input.ctaLink,
    order: input.order,
    isFeatured: input.isFeatured,
    isVisible: input.isVisible
  };
}

export function toMediaItemPayload(input: z.infer<typeof mediaItemInputSchema>) {
  return {
    section: input.section,
    src: input.src,
    alt: input.alt,
    label: input.label || undefined,
    href: input.href,
    positionX: input.positionX,
    positionY: input.positionY,
    order: input.order,
    isFeatured: input.isFeatured,
    isVisible: input.isVisible
  };
}

export function toSurveyPayload(input: z.infer<typeof surveyInputSchema>) {
  return {
    title: input.title,
    slug: input.slug?.trim() || slugify(input.title),
    description: input.description || undefined,
    kind: input.kind,
    status: input.status,
    successCopy: input.successCopy || undefined,
    episodeId: input.episodeId || undefined,
    questions: input.questions.map((question) => ({
      ...question,
      placeholder: question.placeholder || undefined,
      helpText: question.helpText || undefined,
      conditionQuestionId: question.conditionQuestionId || undefined,
      conditionValue: question.conditionValue || undefined
    }))
  };
}
