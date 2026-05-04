import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { identityItemInputSchema, toIdentityItemPayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.identityItem,
  schema: identityItemInputSchema,
  toPayload: toIdentityItemPayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
