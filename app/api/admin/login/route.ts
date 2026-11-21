import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  checkAdminPassword,
  createAdminToken,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!adminAuthConfigured()) {
    console.error(
      "Admin login refused: set ADMIN_PASSWORD and ADMIN_SECRET. There is no built-in password.",
    );
    return NextResponse.json(
      { error: "Admin sign-in is not set up." },
      { status: 503 },
    );
  }

  if (!body.password || !checkAdminPassword(body.password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
