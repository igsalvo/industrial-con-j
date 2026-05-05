import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { eventInputSchema, toEventPayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.event,
  schema: eventInputSchema,
  toPayload: toEventPayload,
  listArgs: { orderBy: [{ startsAt: "asc" }, { order: "asc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
