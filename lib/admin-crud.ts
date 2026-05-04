import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { ensureAdminApiSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/queries";

type ModelDelegate<TPayload> = {
  findMany: (args?: any) => Promise<unknown>;
  create: (args: { data: TPayload }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: TPayload }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
};

export function createAdminCollectionHandlers<TInput, TPayload>({
  model,
  schema,
  toPayload,
  listArgs
}: {
  model: Pick<ModelDelegate<TPayload>, "findMany" | "create">;
  schema: ZodType<TInput>;
  toPayload: (input: TInput) => TPayload;
  listArgs?: unknown;
}) {
  return {
    async GET() {
      const session = await ensureAdminApiSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }

      const records = await model.findMany(listArgs);
      return NextResponse.json(records);
    },
    async POST(request: Request) {
      const session = await ensureAdminApiSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
      if (!hasDatabase()) {
        return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
      }

      try {
        const parsed = schema.parse(await request.json());
        const record = await model.create({ data: toPayload(parsed) });
        return NextResponse.json(record, { status: 201 });
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json({ error: error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
        }

        return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
      }
    }
  };
}

export function createAdminItemHandlers<TInput, TPayload>({
  model,
  schema,
  toPayload
}: {
  model: Pick<ModelDelegate<TPayload>, "update" | "delete">;
  schema: ZodType<TInput>;
  toPayload: (input: TInput) => TPayload;
}) {
  return {
    async PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
      const session = await ensureAdminApiSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
      if (!hasDatabase()) {
        return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
      }

      try {
        const { id } = await params;
        const parsed = schema.parse(await request.json());
        const record = await model.update({ where: { id }, data: toPayload(parsed) });
        return NextResponse.json(record);
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json({ error: error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
        }

        return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
      }
    },
    async DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
      const session = await ensureAdminApiSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
      if (!hasDatabase()) {
        return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
      }

      const { id } = await params;
      await model.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }
  };
}
