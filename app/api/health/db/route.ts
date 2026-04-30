import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json(
      {
        ok: false,
        error: "DATABASE_URL is not configured."
      },
      { status: 503 }
    );
  }

  try {
    const startedAt = Date.now();
    await prisma.$queryRaw`select 1`;

    return NextResponse.json({
      ok: true,
      latencyMs: Date.now() - startedAt
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Database connection failed."
      },
      { status: 503 }
    );
  }
}
