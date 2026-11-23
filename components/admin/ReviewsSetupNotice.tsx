import type { ReviewsUnavailableError } from "@/lib/reviews-store";

export function ReviewsSetupNotice({
  reason,
}: {
  reason: ReviewsUnavailableError["reason"];
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-8">
      <h1 className="font-heading text-3xl text-primary">Reviews</h1>
      {reason === "missing_table" ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The reviews table is not in Supabase yet, so this page cannot load
          them. In the alikhanye-project SQL Editor, run{" "}
          <span className="font-medium text-foreground">
            supabase/migrations/002_reviews.sql
          </span>
          . The public site hides the reviews section until that table exists.
        </p>
      ) : (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Supabase is not configured, so reviews cannot be saved. Add the
          Supabase keys, run the reviews migration, then reload this page.
        </p>
      )}
    </div>
  );
}
