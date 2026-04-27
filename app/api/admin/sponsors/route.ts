import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ensureAdminApiSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { sponsorInputSchema, toSponsorPayload } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const sponsor = await prisma.sponsor.create({
      data: toSponsorPayload(sponsorInputSchema.parse(await request.json()))
    });

    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
  }
}
