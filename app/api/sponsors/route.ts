import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
  });

  return NextResponse.json(sponsors);
}
