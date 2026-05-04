import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { productCategoryInputSchema, toProductCategoryPayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.productCategory,
  schema: productCategoryInputSchema,
  toPayload: toProductCategoryPayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
