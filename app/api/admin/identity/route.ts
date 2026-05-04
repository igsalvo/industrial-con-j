import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { identityItemInputSchema, toIdentityItemPayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.identityItem,
  schema: identityItemInputSchema,
  toPayload: toIdentityItemPayload,
  listArgs: { orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
