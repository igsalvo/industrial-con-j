import { NextResponse } from "next/server";
import { ensureAdminApiSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { episodeInputSchema, toEpisodePayload } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await ensureAdminApiSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
  }
}
