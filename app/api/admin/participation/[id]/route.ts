import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { participationItemInputSchema, toParticipationItemPayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.participationItem,
  schema: participationItemInputSchema,
  toPayload: toParticipationItemPayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
