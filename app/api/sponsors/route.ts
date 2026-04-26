import { NextResponse } from "next/server";
import { getAllSponsors } from "@/lib/queries";

export async function GET() {
  const sponsors = await getAllSponsors();

  return NextResponse.json(sponsors);
}
