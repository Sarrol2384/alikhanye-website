"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import type { Review } from "@/lib/reviews-store";

type ReviewsTableProps = {
  reviews: Review[];
};

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function remove(review: Review) {
    if (!window.confirm(`Delete the review from ${review.clientName}?`)) return;
    setPendingId(review.id);
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "DELETE",
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete review");
      }
      toast.success("Review deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete review");
    } finally {
      setPendingId(null);
    }
  }

  async function togglePublished(review: Review) {
    setPendingId(review.id);
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !review.published }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not update the review");
      }
      toast.success(review.published ? "Review hidden" : "Review published");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the review",
      );
    } finally {
      setPendingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Reviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add client comments. They stay off the website until you publish
            them.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/admin/reviews/new">Add review</LinkButton>
          <Button type="button" variant="outline" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-xl text-primary">No reviews yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add the first one when a client sends feedback.
          </p>
          <LinkButton href="/admin/reviews/new" className="mt-6">
            Add review
          </LinkButton>
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-primary">
                    {review.clientName}
                    {review.suburb ? (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · {review.suburb}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {review.rating} out of 5 ·{" "}
                    {review.published ? "Published" : "Hidden"} · Order{" "}
                    {review.sortOrder}
                    {review.createdAt ? ` · ${formatDate(review.createdAt)}` : ""}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground">
                    {review.comment}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pendingId === review.id}
                    onClick={() => void togglePublished(review)}
                  >
                    {review.published ? "Unpublish" : "Publish"}
                  </Button>
                  <LinkButton href={`/admin/reviews/${review.id}`} size="sm">
                    Edit
                  </LinkButton>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={pendingId === review.id}
                    onClick={() => void remove(review)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
