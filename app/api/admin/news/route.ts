import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { newsItemInputSchema, toNewsItemPayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.newsItem,
  schema: newsItemInputSchema,
  toPayload: toNewsItemPayload,
  listArgs: { orderBy: [{ publishedAt: "desc" }, { order: "asc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
