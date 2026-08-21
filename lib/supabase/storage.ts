import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export const PROPERTY_IMAGES_BUCKET = "property-images";

export async function ensurePropertyImagesBucket(
  supabase: SupabaseClient<Database>,
): Promise<void> {
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(`Could not list storage buckets: ${listError.message}`);
  }

  const exists = buckets.some((bucket) => bucket.name === PROPERTY_IMAGES_BUCKET);
  if (exists) return;

  const { error: createError } = await supabase.storage.createBucket(
    PROPERTY_IMAGES_BUCKET,
    { public: true },
  );

  if (createError && !createError.message.includes("already exists")) {
    throw new Error(
      `Could not create storage bucket "${PROPERTY_IMAGES_BUCKET}": ${createError.message}`,
    );
  }
}

export function getPublicStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  return `${base}/storage/v1/object/public/${PROPERTY_IMAGES_BUCKET}/${path}`;
}
