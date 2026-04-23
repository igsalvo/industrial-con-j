import { NextResponse } from "next/server";
import { getSearchResults } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = await getSearchResults({
    q: searchParams.get("q") || undefined,
    guest: searchParams.get("guest") || undefined,
    tag: searchParams.get("tag") || undefined,
    industry: searchParams.get("industry") || undefined
  });

  return NextResponse.json(data);
}
