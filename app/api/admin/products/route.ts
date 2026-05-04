import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { productInputSchema, toProductPayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.product,
  schema: productInputSchema,
  toPayload: toProductPayload,
  listArgs: { include: { category: true }, orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
