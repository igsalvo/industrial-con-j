import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const payload = contactMessageSchema.parse(await request.json());

    const id = randomUUID();
    const message = [
      payload.subject ? `Asunto: ${payload.subject}` : null,
      payload.motive ? `Motivo: ${payload.motive}` : null,
      payload.message
    ]
      .filter(Boolean)
      .join("\n\n");

    await prisma.$executeRaw(
      Prisma.sql`INSERT INTO "ContactMessage" ("id", "type", "name", "email", "phone", "company", "message", "createdAt") VALUES (${id}, ${payload.type}, ${payload.name}, ${payload.email}, ${payload.phone || null}, ${payload.company || null}, ${message}, NOW())`
    );

    return NextResponse.json({
      ok: true,
      id,
      message: "Gracias. Recibimos tu mensaje."
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar el mensaje." }, { status: 400 });
  }
}
