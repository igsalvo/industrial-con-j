import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const guests = await prisma.guest.findMany({
    include: {
      episodes: {
        take: 3
      }
    },
    orderBy: { name: "asc" }
  });

  return NextResponse.json(guests);
}
