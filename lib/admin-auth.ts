import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "alikhanye_admin";

function readSecret(name: "ADMIN_PASSWORD" | "ADMIN_SECRET"): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

/** Login is refused until both values are set. There is no built-in password. */
export function adminAuthConfigured(): boolean {
  return Boolean(readSecret("ADMIN_PASSWORD") && readSecret("ADMIN_SECRET"));
}

function signToken(password: string, secret: string): string {
  const payload = `ok:${password}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  const password = readSecret("ADMIN_PASSWORD");
  const secret = readSecret("ADMIN_SECRET");
  if (!token || !password || !secret) return false;

  const expected = signToken(password, secret);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function checkAdminPassword(password: string): boolean {
  const expected = readSecret("ADMIN_PASSWORD");
  const secret = readSecret("ADMIN_SECRET");
  if (!expected || !secret || !password) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createAdminToken(): string {
  const password = readSecret("ADMIN_PASSWORD");
  const secret = readSecret("ADMIN_SECRET");
  if (!password || !secret) {
    throw new Error("Admin auth is not configured");
  }
  return signToken(password, secret);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!adminAuthConfigured()) return false;
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}
