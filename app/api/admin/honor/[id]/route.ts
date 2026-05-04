import { createAdminItemHandlers } from "@/lib/admin-crud";
import { prisma } from "@/lib/prisma";
import { honorMemberInputSchema, toHonorMemberPayload } from "@/lib/validation";

const handlers = createAdminItemHandlers({
  model: prisma.honorMember,
  schema: honorMemberInputSchema,
  toPayload: toHonorMemberPayload
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
