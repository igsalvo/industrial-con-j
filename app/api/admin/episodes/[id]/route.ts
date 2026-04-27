import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ensureAdminApiSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { episodeInputSchema, toEpisodePayload } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }
  const { id } = await params;

  try {
    const parsed = episodeInputSchema.parse(await request.json());
    const payload = toEpisodePayload(parsed);
    const { guestIds, ...episodeData } = payload;

    const episode = await prisma.episode.update({
      where: { id },
      data: {
        ...episodeData,
        guests: {
          set: guestIds.map((guestId) => ({ id: guestId }))
        }
      }
    });

    return NextResponse.json(episode);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }
  const { id } = await params;

  await prisma.episode.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
