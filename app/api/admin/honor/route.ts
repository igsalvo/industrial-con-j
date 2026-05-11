import { createAdminCollectionHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { honorMemberInputSchema, toHonorMemberPayload } from "@/lib/validation";

const handlers = createAdminCollectionHandlers({
  model: prisma.honorMember,
  schema: honorMemberInputSchema,
  toPayload: toHonorMemberPayload,
  listArgs: { orderBy: [{ name: "asc" }] }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
