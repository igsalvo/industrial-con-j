import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { newsItemInputSchema, toNewsItemPayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.newsItem,
  schema: newsItemInputSchema,
  toPayload: toNewsItemPayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
