import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hasDatabase } from "@/lib/queries";

const CONTENT_FIELD_MAP = {
  site_logo_url: {
    label: "URL del logo",
    type: "url",
    siteConfigField: "logoUrl"
  }
} as const;

type ContentKey = keyof typeof CONTENT_FIELD_MAP;

function isContentKey(key: string): key is ContentKey {
  return key in CONTENT_FIELD_MAP;
}

function getSafeDatabaseStatus() {
  return Boolean(process.env.DATABASE_URL);
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContentValue(type: string, value: string) {
  if (!value) {
    return null;
  }

  if (type === "url") {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        return "La URL debe comenzar con http:// o https://.";
      }
    } catch {
      return "Ingresa una URL válida.";
    }
  }

  return null;
}

async function readContentValue(key: ContentKey) {
  const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });
  const field = CONTENT_FIELD_MAP[key].siteConfigField;
  return normalizeString(config?.[field]);
}

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  console.info("[content:get]", {
    key,
    hasDatabaseUrl: getSafeDatabaseStatus(),
    source: "SiteConfig"
  });

  if (!isContentKey(key)) {
    return NextResponse.json({ success: false, error: "Content key not supported." }, { status: 404 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ success: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const definition = CONTENT_FIELD_MAP[key];
    const value = await readContentValue(key);

    return NextResponse.json({
      success: true,
      data: {
        key,
        label: definition.label,
        valueEs: value,
        valueEn: value,
        type: definition.type
      }
    });
  } catch (error) {
    console.error("[content:get] failed", { key, error });
    return NextResponse.json({ success: false, error: "No se pudo leer el contenido." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const payload = (await request.json()) as Record<string, unknown>;

  console.info("[content:patch] received", {
    key,
    payloadKeys: Object.keys(payload),
    hasDatabaseUrl: getSafeDatabaseStatus()
  });

  if (!isContentKey(key)) {
    return NextResponse.json({ success: false, error: "Content key not supported." }, { status: 404 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ success: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const definition = CONTENT_FIELD_MAP[key];
  const value = normalizeString(payload.valueEs ?? payload.valueEn);
  const validationError = validateContentValue(definition.type, value);

  if (validationError) {
    console.info("[content:patch] validation failed", { key, type: definition.type });
    return NextResponse.json({ success: false, error: validationError }, { status: 400 });
  }

  try {
    const updateResult = await prisma.siteConfig.updateMany({
      where: { id: "default" },
      data: { [definition.siteConfigField]: value || null }
    });

    let wroteBy = "update";
    if (updateResult.count === 0) {
      wroteBy = "create";
      await prisma.siteConfig.create({
        data: {
          id: "default",
          [definition.siteConfigField]: value || null
        }
      });
    }

    revalidatePath("/");
    revalidatePath("/", "layout");

    console.info("[content:patch] persisted", {
      key,
      wroteBy,
      affectedRows: updateResult.count,
      revalidated: ["/", "layout"]
    });

    return NextResponse.json({
      success: true,
      data: {
        key,
        label: definition.label,
        valueEs: value,
        valueEn: value,
        type: definition.type
      }
    });
  } catch (error) {
    console.error("[content:patch] failed", { key, error });
    return NextResponse.json({ success: false, error: "No se pudo guardar el contenido." }, { status: 500 });
  }
}
