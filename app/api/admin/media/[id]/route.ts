import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { mediaItemInputSchema, toMediaItemPayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.mediaItem,
  schema: mediaItemInputSchema,
  toPayload: toMediaItemPayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
