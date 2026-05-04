import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { participationItemInputSchema, toParticipationItemPayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.participationItem,
  schema: participationItemInputSchema,
  toPayload: toParticipationItemPayload,
  listArgs: { orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
