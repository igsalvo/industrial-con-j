import { NextResponse } from "next/server";
import { getGuestBySlug } from "@/lib/queries";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }

  return NextResponse.json(guest);
}
