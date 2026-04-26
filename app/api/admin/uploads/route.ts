import { NextResponse } from "next/server";
import { ensureAdminApiSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(
    { error: "La subida local no esta habilitada en Vercel. Usa una URL publica de imagen por ahora." },
    { status: 501 }
  );
}
