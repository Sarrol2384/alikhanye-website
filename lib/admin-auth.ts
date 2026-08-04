import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "alikhanye_admin";

function getPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || "alikhanye2026";
}

function getSecret(): string {
  return process.env.ADMIN_SECRET?.trim() || `secret:${getPassword()}`;
}

function signToken(): string {
  const payload = `ok:${getPassword()}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = signToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function checkAdminPassword(password: string): boolean {
  const expected = getPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createAdminToken(): string {
  return signToken();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}
