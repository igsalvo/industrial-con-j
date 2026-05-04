import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const payload = contactMessageSchema.parse(await request.json());

    const created = await prisma.contactMessage.create({
      data: {
        type: payload.type,
        name: payload.name,
        email: payload.email,
        subject: payload.subject || undefined,
        motive: payload.motive || undefined,
        phone: payload.phone || undefined,
        company: payload.company || undefined,
        message: payload.message
      }
    });

    return NextResponse.json({
      ok: true,
      id: created.id,
      message: "Gracias. Recibimos tu mensaje."
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar el mensaje." }, { status: 400 });
  }
}
