import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { productCategoryInputSchema, toProductCategoryPayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.productCategory,
  schema: productCategoryInputSchema,
  toPayload: toProductCategoryPayload,
  listArgs: { orderBy: [{ order: "asc" }, { name: "asc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
