import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation";

function isMissingColumnError(error: unknown) {
  return error instanceof Error && /column .* does not exist/i.test(error.message);
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const payload = contactMessageSchema.parse(await request.json());

    const baseData = {
      type: payload.type,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || undefined,
      company: payload.company || undefined,
      message: payload.message
    };

    let created;
    try {
      created = await prisma.contactMessage.create({
        data: {
          ...baseData,
          subject: payload.subject || undefined,
          motive: payload.motive || undefined
        }
      });
    } catch (error) {
      if (!isMissingColumnError(error)) {
        throw error;
      }

      const id = randomUUID();
      await prisma.$executeRaw(
        Prisma.sql`INSERT INTO "ContactMessage" ("id", "type", "name", "email", "phone", "company", "message", "createdAt") VALUES (${id}, ${baseData.type}, ${baseData.name}, ${baseData.email}, ${baseData.phone ?? null}, ${baseData.company ?? null}, ${baseData.message}, NOW())`
      );
      created = { id };
    }

    return NextResponse.json({
      ok: true,
      id: created.id,
      message: "Gracias. Recibimos tu mensaje."
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar el mensaje." }, { status: 400 });
  }
}
