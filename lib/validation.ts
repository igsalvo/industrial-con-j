import { z } from "zod";
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

const optionalUrl = z.string().trim().url().or(z.literal("")).optional().transform((value) => value || undefined);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const guestInputSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  bio: z.string().min(10),
  company: z.string().optional(),
  role: z.string().optional(),
  profileImage: optionalUrl,
  industries: z.string().optional(),
  linkedin: optionalUrl,
  x: optionalUrl,
  website: optionalUrl
});

export const sponsorInputSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  websiteUrl: z.string().url(),
  logoUrl: optionalUrl,
  description: z.string().optional(),
  tier: z.string().optional(),
  isFeatured: z.boolean().default(false)
});

export const episodeInputSchema = z.object({
  title: z.string().min(4),
  slug: z.string().optional(),
  shortDescription: z.string().min(10),
  longDescription: z.string().min(30),
  timestamps: z.string().optional(),
  spotifyUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  applePodcastsUrl: optionalUrl,
  videoEmbedUrl: optionalUrl,
  audioEmbedUrl: optionalUrl,
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
  publishedAt: z.string().optional()
});

export const surveyQuestionInputSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(3),
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
  title: z.string().min(3),
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

export function toGuestPayload(input: z.infer<typeof guestInputSchema>) {
  return {
    name: input.name,
    slug: input.slug?.trim() || slugify(input.name),
    bio: input.bio,
    company: input.company || undefined,
    role: input.role || undefined,
    profileImage: input.profileImage,
    industries: normalizeList(input.industries || ""),
    socialLinks: {
      linkedin: input.linkedin,
      x: input.x,
      website: input.website
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
    isFeatured: input.isFeatured
  };
}

export function toEpisodePayload(input: z.infer<typeof episodeInputSchema>) {
  return {
    title: input.title,
    slug: input.slug?.trim() || slugify(input.title),
    shortDescription: input.shortDescription,
    longDescription: input.longDescription,
    timestamps: normalizeList(input.timestamps || ""),
    spotifyUrl: input.spotifyUrl,
    youtubeUrl: input.youtubeUrl,
    applePodcastsUrl: input.applePodcastsUrl,
    videoEmbedUrl: input.videoEmbedUrl,
    audioEmbedUrl: input.audioEmbedUrl,
    clipThumbnailUrl: input.clipThumbnailUrl,
    clipVideoUrl: input.clipVideoUrl,
    tags: normalizeList(input.tags || ""),
    industries: normalizeList(input.industries || ""),
    resourceLinks: input.resourceLinks,
    sponsorId: input.sponsorId || undefined,
    isFeatured: input.isFeatured,
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
    guestIds: input.guestIds
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
