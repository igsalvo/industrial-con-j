import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { surveyResponseSchema } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const payload = surveyResponseSchema.parse(await request.json());

    if (payload.surveyId !== id) {
      return NextResponse.json({ error: "Survey id mismatch." }, { status: 400 });
    }

    const created = await prisma.surveyResponse.create({
      data: {
        surveyId: payload.surveyId,
        name: payload.name || undefined,
        email: payload.email || undefined,
        fingerprint: payload.fingerprint,
        answers: {
          create: payload.answers
        }
      }
    });

    return NextResponse.json({
      ok: true,
      id: created.id,
      message: "Gracias por participar."
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Ya registramos una respuesta desde este dispositivo." }, { status: 409 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar la respuesta." }, { status: 400 });
  }
}
