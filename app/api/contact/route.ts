import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation";
import { sendFormEmail } from "@/lib/email";

const FORM_LABELS = {
  CONTACT: "Contacto",
  DONATION: "Donación",
  SPONSORSHIP: "Auspicio",
  PARTICIPATION: "Participación"
} as const;

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const payload = contactMessageSchema.parse(await request.json());

    const id = randomUUID();
    const emailText = [
      `Nueva solicitud: ${FORM_LABELS[payload.type]}`,
      "",
      `Nombre: ${payload.name}`,
      `Correo: ${payload.email}`,
      payload.phone ? `Teléfono: ${payload.phone}` : null,
      payload.company ? `Organización: ${payload.company}` : null,
      payload.subject ? `Asunto: ${payload.subject}` : null,
      payload.motive ? `Motivo: ${payload.motive}` : null,
      "",
      payload.message
    ]
      .filter(Boolean)
      .join("\n");

    await prisma.$executeRaw(
      Prisma.sql`INSERT INTO "ContactMessage" ("id", "type", "name", "email", "subject", "motive", "phone", "company", "message", "createdAt") VALUES (${id}, ${payload.type}, ${payload.name}, ${payload.email}, ${payload.subject || null}, ${payload.motive || null}, ${payload.phone || null}, ${payload.company || null}, ${payload.message}, NOW())`
    );

    const result = await sendFormEmail({
      replyTo: payload.email,
      subject: payload.subject || `Nueva solicitud de ${FORM_LABELS[payload.type].toLowerCase()}`,
      text: emailText
    });

    return NextResponse.json({
      ok: true,
      id,
      emailSkipped: result.skipped,
      message: result.skipped
        ? "Mensaje registrado. Falta configurar RESEND_API_KEY para enviar el correo."
        : "Gracias. Recibimos tu mensaje."
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar el mensaje." }, { status: 400 });
  }
}
