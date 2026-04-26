import { NextResponse } from "next/server";
import { getAllEpisodes } from "@/lib/queries";

export async function GET() {
  const episodes = await getAllEpisodes();

  return NextResponse.json(episodes);
}
