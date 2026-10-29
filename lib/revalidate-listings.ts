import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { LISTINGS_CACHE_TAG } from "@/lib/listings-cache";

/** Drop cached public listings after an admin create, update or delete. */
export function revalidatePublicListings(id?: string): void {
  revalidateTag(LISTINGS_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/sitemap.xml");
  if (!id) return;
  revalidatePath(`/properties/${id}`);
  revalidatePath(`/properties/${id}/opengraph-image`);
}
