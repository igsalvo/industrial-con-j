import { NextResponse } from "next/server";
import { getEpisodeBySlug, getRelatedEpisodes } from "@/lib/queries";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);

  if (!episode) {
    return NextResponse.json({ error: "Episode not found." }, { status: 404 });
  }

  const related = await getRelatedEpisodes(episode.tags, episode.id);

  return NextResponse.json({
    episode,
    related
  });
}
