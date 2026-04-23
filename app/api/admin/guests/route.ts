import { NextResponse } from "next/server";
import { ensureAdminApiSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { guestInputSchema, toGuestPayload } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const payload = toGuestPayload(guestInputSchema.parse(await request.json()));
    const guest = await prisma.guest.create({ data: payload });
    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
  }
}
