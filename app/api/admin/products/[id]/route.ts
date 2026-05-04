import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { productInputSchema, toProductPayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.product,
  schema: productInputSchema,
  toPayload: toProductPayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
