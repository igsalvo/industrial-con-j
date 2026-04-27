import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { ensureAdminApiSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se encontro ningun archivo." }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Falta configurar BLOB_READ_WRITE_TOKEN para subir archivos." },
      { status: 503 }
    );
  }

  const blob = await put(`industrial-con-j/${Date.now()}-${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });

  return NextResponse.json({ url: blob.url });
}
