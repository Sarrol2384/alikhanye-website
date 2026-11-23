import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { REVIEWS_CACHE_TAG } from "@/lib/reviews-cache";

/** Drop cached public reviews after an admin create, update or delete. */
export function revalidatePublicReviews(): void {
  revalidateTag(REVIEWS_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
}
