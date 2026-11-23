import { redirect } from "next/navigation";
import { ReviewsSetupNotice } from "@/components/admin/ReviewsSetupNotice";
import { ReviewsTable } from "@/components/admin/ReviewsTable";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  readAllReviews,
  ReviewsUnavailableError,
  type Review,
} from "@/lib/reviews-store";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let reviews: Review[] = [];
  let unavailable: ReviewsUnavailableError["reason"] | null = null;

  try {
    reviews = await readAllReviews();
  } catch (error) {
    if (!(error instanceof ReviewsUnavailableError)) throw error;
    unavailable = error.reason;
  }

  if (unavailable) {
    return <ReviewsSetupNotice reason={unavailable} />;
  }

  return <ReviewsTable reviews={reviews} />;
}
