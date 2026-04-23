import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { setAdminCookie, signAdminToken, validateAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const admin = await validateAdminCredentials(body.email, body.password);

    if (!admin) {
      return NextResponse.json({ error: "Credenciales invalidas." }, { status: 401 });
    }

    const token = signAdminToken({
      sub: admin.id,
      email: admin.email,
      role: admin.role
    });

    await setAdminCookie(token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo iniciar sesion." },
      { status: 400 }
    );
  }
}
