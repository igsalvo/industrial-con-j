import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation";
import { sendFormEmail } from "@/lib/email";
import { ZodError } from "zod";

export const maxDuration = 15;

const DB_TIMEOUT_MS = 5000;

const FORM_LABELS = {
  CONTACT: "Contacto",
  DONATION: "Donación",
  SPONSORSHIP: "Auspicio",
  PARTICIPATION: "Participación"
} as const;

function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(errorMessage)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}

export async function POST(request: Request) {
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

    const result = await sendFormEmail({
      replyTo: payload.email,
      subject: payload.subject || `Nueva solicitud de ${FORM_LABELS[payload.type].toLowerCase()}`,
      text: emailText
    });

    let storageSkipped = !hasDatabase();
    if (hasDatabase()) {
      try {
        await withTimeout(
          prisma.$executeRaw(
            Prisma.sql`INSERT INTO "ContactMessage" ("id", "type", "name", "email", "subject", "motive", "phone", "company", "message", "createdAt") VALUES (${id}, ${payload.type}, ${payload.name}, ${payload.email}, ${payload.subject || null}, ${payload.motive || null}, ${payload.phone || null}, ${payload.company || null}, ${payload.message}, NOW())`
          ),
          DB_TIMEOUT_MS,
          "Timeout guardando el mensaje en la base de datos."
        );
        storageSkipped = false;
      } catch (storageError) {
        storageSkipped = true;
        console.error("[api/contact] message storage failed", storageError);
      }
    }

    return NextResponse.json({
      ok: true,
      id,
      emailSkipped: result.skipped,
      storageSkipped,
      message: result.skipped
        ? "Recibimos tu solicitud. Falta configurar RESEND_API_KEY para enviar el correo."
        : "Gracias. Recibimos tu mensaje."
    });
  } catch (error) {
    const message = error instanceof ZodError
      ? error.issues[0]?.message || "Revisa los datos del formulario."
      : error instanceof Error
        ? error.message
        : "No se pudo guardar el mensaje.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
