import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ensureAdminApiSession } from "@/lib/auth";
import { getAllEpisodes, hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { episodeInputSchema, toEpisodePayload } from "@/lib/validation";

export async function GET() {
  const session = await ensureAdminApiSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const episodes = await getAllEpisodes();
  return NextResponse.json(episodes);
}

export async function POST(request: Request) {
  const session = await ensureAdminApiSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const parsed = episodeInputSchema.parse(await request.json());
    const payload = toEpisodePayload(parsed);

    const episode = await prisma.episode.create({
      data: {
        ...payload,
        guests: {
          connect: payload.guestIds.map((id) => ({ id }))
        }
      }
    });

    return NextResponse.json(episode, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
  }
}
