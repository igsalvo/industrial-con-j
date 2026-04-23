import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const episodes = await prisma.episode.findMany({
    include: { guests: true, sponsor: true },
    orderBy: { publishedAt: "desc" }
  });

  return NextResponse.json(episodes);
}
