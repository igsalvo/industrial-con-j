import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

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

async function sendQuoteEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTE_EMAIL_FROM || "Industrial con J <onboarding@resend.dev>";

  if (!apiKey) {
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "No se pudo enviar el correo.");
  }

  return { skipped: false };
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const payload = quoteSchema.parse(await request.json());
    const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });
    const quoteEmail = config?.productQuoteEmail || process.env.PRODUCT_QUOTE_EMAIL;

    if (!quoteEmail) {
      return NextResponse.json({ error: "El correo de cotizaciones no está configurado." }, { status: 503 });
    }

    const emailText = buildEmailText(payload);
    const id = randomUUID();

    await prisma.$executeRaw(
      Prisma.sql`INSERT INTO "ContactMessage" ("id", "type", "name", "email", "subject", "motive", "message", "createdAt") VALUES (${id}, ${"PARTICIPATION"}, ${payload.name}, ${payload.email}, ${"Cotización TienDIIta"}, ${"TienDIIta CEIN"}, ${emailText}, NOW())`
    );

    const result = await sendQuoteEmail({
      to: quoteEmail,
      subject: "Nueva cotización TienDIIta",
      text: emailText
    });

    return NextResponse.json({
      ok: true,
      id,
      emailSkipped: result.skipped,
      message: result.skipped ? "Cotización registrada. Falta configurar RESEND_API_KEY para enviar el correo." : "Cotización enviada correctamente."
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo enviar la cotización." }, { status: 400 });
  }
}
