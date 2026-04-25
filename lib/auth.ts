import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "industrial_con_j_admin_token";

type AdminToken = {
  sub: string;
  email: string;
  role: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

function getAdminLoginEmail() {
  return process.env.ADMIN_LOGIN_EMAIL ?? process.env.ADMIN_SEED_EMAIL;
}

function getAdminLoginPassword() {
  return process.env.ADMIN_LOGIN_PASSWORD ?? process.env.ADMIN_SEED_PASSWORD;
}

export async function validateAdminCredentials(email: string, password: string) {
  const adminEmail = getAdminLoginEmail();
  const adminPassword = getAdminLoginPassword();

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD are not configured.");
  }

  if (email !== adminEmail || password !== adminPassword) {
    return null;
  }

  return {
    id: "mvp-admin",
    email: adminEmail,
    role: "admin"
  };
}

export function signAdminToken(payload: AdminToken) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d"
  });
}

export function verifyAdminToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as AdminToken;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function ensureAdminApiSession() {
  return getAdminSession();
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
