import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { ReviewsSetupNotice } from "@/components/admin/ReviewsSetupNotice";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getReviewById,
  ReviewsUnavailableError,
  type Review,
} from "@/lib/reviews-store";

export const dynamic = "force-dynamic";

type EditReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  let review: Review | null = null;
  let unavailable: ReviewsUnavailableError["reason"] | null = null;

  try {
    review = await getReviewById(id);
  } catch (error) {
    if (!(error instanceof ReviewsUnavailableError)) throw error;
    unavailable = error.reason;
  }

  if (unavailable) {
    return <ReviewsSetupNotice reason={unavailable} />;
  }

  if (!review) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/reviews"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to reviews
        </Link>
        <h1 className="mt-3 font-heading text-3xl text-primary">Edit review</h1>
        <p className="mt-1 text-sm text-muted-foreground">{review.clientName}</p>
      </div>
      <ReviewForm mode="edit" initial={review} />
    </div>
  );
}
