import Link from "next/link";
import { redirect } from "next/navigation";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { ReviewsSetupNotice } from "@/components/admin/ReviewsSetupNotice";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readAllReviews, ReviewsUnavailableError } from "@/lib/reviews-store";

export const dynamic = "force-dynamic";

export default async function NewReviewPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  try {
    await readAllReviews();
  } catch (error) {
    if (error instanceof ReviewsUnavailableError) {
      return <ReviewsSetupNotice reason={error.reason} />;
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/reviews"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to reviews
        </Link>
        <h1 className="mt-3 font-heading text-3xl text-primary">Add review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          It stays hidden until you tick Published.
        </p>
      </div>
      <ReviewForm mode="create" />
    </div>
  );
}
