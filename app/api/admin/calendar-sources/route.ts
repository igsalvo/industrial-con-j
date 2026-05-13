import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { calendarSourceInputSchema, toCalendarSourcePayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.calendarSource,
  schema: calendarSourceInputSchema,
  toPayload: toCalendarSourcePayload,
  listArgs: { orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
