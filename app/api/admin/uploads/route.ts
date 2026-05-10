import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { put } from "@vercel/blob";
import { ensureAdminApiSession } from "@/lib/auth";

const MAX_UPLOAD_SIZE_BYTES = 250 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Falta configurar BLOB_READ_WRITE_TOKEN para subir archivos." },
        { status: 503 }
      );
    }

    try {
      const body = (await request.json()) as HandleUploadBody;
      const response = await handleUpload({
        request,
        body,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ["image/*", "video/mp4", "video/webm", "video/quicktime"],
          maximumSizeInBytes: MAX_UPLOAD_SIZE_BYTES,
          addRandomSuffix: true
        }),
        onUploadCompleted: async ({ blob }) => {
          console.info("File upload completed", blob.url);
        }
      });

      return NextResponse.json(response);
    } catch (error) {
      console.error("Client upload setup failed", error);
      return NextResponse.json(
        { error: "No se pudo preparar la subida. Revisa BLOB_READ_WRITE_TOKEN en Vercel." },
        { status: 500 }
      );
    }
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

  try {
    const blob = await put(`industrial-con-j/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("File upload failed", error);
    return NextResponse.json(
      { error: "No se pudo subir el archivo. Revisa que BLOB_READ_WRITE_TOKEN este configurado correctamente." },
      { status: 500 }
    );
  }
}
