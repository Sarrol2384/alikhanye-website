import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import {
  ensurePropertyImagesBucket,
  getPublicStorageUrl,
  PROPERTY_IMAGES_BUCKET,
} from "@/lib/supabase/storage";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionForType(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Use JPG, PNG, WebP, or GIF images only" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 6MB" },
        { status: 400 },
      );
    }

    const ext = extensionForType(file.type);
    const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isSupabaseConfigured()) {
      const supabase = createSupabaseAdmin();
      await ensurePropertyImagesBucket(supabase);

      const { error } = await supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .upload(name, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json({ url: getPublicStorageUrl(name) });
    }

    const dir = path.join(process.cwd(), "public", "properties");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), buffer);

    return NextResponse.json({ url: `/properties/${name}` });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Upload failed. Try again.",
      },
      { status: 500 },
    );
  }
}
