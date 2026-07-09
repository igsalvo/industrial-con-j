import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { sendFormEmail } from "@/lib/email";

export const maxDuration = 15;

const DB_TIMEOUT_MS = 5000;
const CEIN_QUOTE_EMAIL = "cein@cein.cl";
const QUOTE_CC_EMAIL = "vinculacion.dii@uchile.cl";

const quoteSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre."),
  email: z.string().trim().email("Ingresa un correo válido."),
  note: z.string().trim().optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        name: z.string().trim().min(1),
        quantity: z.coerce.number().int().positive(),
        price: z.coerce.number().min(0).optional()
      })
    )
    .min(1, "Agrega al menos un producto.")
});

function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(errorMessage)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}

function formatPrice(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `$${value.toLocaleString("es-CL")}` : "Sin precio";
}

function buildEmailText(payload: z.infer<typeof quoteSchema>) {
  const requestedAt = new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Santiago"
  }).format(new Date());

  const items = payload.items
    .map((item) => `- ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: ${formatPrice(item.price)}`)
    .join("\n\n");

  return [
    "Nueva cotización TienDIIta",
    "",
    `Fecha de solicitud: ${requestedAt}`,
    `Nombre: ${payload.name}`,
    `Correo: ${payload.email}`,
    payload.note ? `Mensaje: ${payload.note}` : null,
    "",
    "Productos:",
    items
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  try {
    const payload = quoteSchema.parse(await request.json());
    const emailText = buildEmailText(payload);
    const id = randomUUID();

    const result = await sendFormEmail({
      to: CEIN_QUOTE_EMAIL,
      cc: QUOTE_CC_EMAIL,
      replyTo: payload.email,
      subject: "Nueva cotización TienDIIta",
      text: emailText
    });

    let storageSkipped = !hasDatabase();
    if (hasDatabase()) {
      try {
        await withTimeout(
          prisma.$executeRaw(
            Prisma.sql`INSERT INTO "ContactMessage" ("id", "type", "name", "email", "subject", "motive", "message", "createdAt") VALUES (${id}, ${"PARTICIPATION"}, ${payload.name}, ${payload.email}, ${"Cotización TienDIIta"}, ${"TienDIIta CEIN"}, ${emailText}, NOW())`
          ),
          DB_TIMEOUT_MS,
          "Timeout guardando la cotización en la base de datos."
        );
        storageSkipped = false;
      } catch (storageError) {
        storageSkipped = true;
        console.error("[api/tiendiita/quote] quote storage failed", storageError);
      }
    }

    return NextResponse.json({
      ok: true,
      id,
      storageSkipped,
      emailSkipped: result.skipped,
      message: result.skipped ? "Recibimos tu cotización. Falta configurar RESEND_API_KEY para enviar el correo." : "Cotización enviada correctamente."
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo enviar la cotización." }, { status: 400 });
  }
}
