import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { mediaItemInputSchema, toMediaItemPayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.mediaItem,
  schema: mediaItemInputSchema,
  toPayload: toMediaItemPayload,
  listArgs: { orderBy: [{ section: "asc" }, { order: "asc" }, { updatedAt: "desc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
