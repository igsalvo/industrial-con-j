import { NextResponse } from "next/server";
import { ensureAdminApiSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sponsorInputSchema, toSponsorPayload } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;

  try {
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: toSponsorPayload(sponsorInputSchema.parse(await request.json()))
    });

    return NextResponse.json(sponsor);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.sponsor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
