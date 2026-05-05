import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { eventInputSchema, toEventPayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.event,
  schema: eventInputSchema,
  toPayload: toEventPayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
