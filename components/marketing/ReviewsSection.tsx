import { Star } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { readCachedPublishedReviews, type Review } from "@/lib/reviews-store";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  const safe = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <p className="flex gap-0.5" aria-label={`${safe} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < safe;
        return (
          <Star
            key={index}
            aria-hidden
            className={cn(
              "size-4",
              filled ? "fill-gold text-gold" : "text-gold/30",
            )}
          />
        );
      })}
    </p>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground sm:text-base">
        {review.comment}
      </blockquote>
      <figcaption className="mt-5 text-sm">
        <span className="font-medium text-primary">{review.clientName}</span>
        {review.suburb ? (
          <span className="text-muted-foreground"> · {review.suburb}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

export async function ReviewsSection() {
  const reviews = await readCachedPublishedReviews();
  if (reviews.length === 0) return null;

  return (
    <section className="px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Clients"
          title="What our clients say"
          description="From people Wendy has helped buy or sell."
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="animate-section-reveal">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
