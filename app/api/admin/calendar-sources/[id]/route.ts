import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { calendarSourceInputSchema, toCalendarSourcePayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.calendarSource,
  schema: calendarSourceInputSchema,
  toPayload: toCalendarSourcePayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
