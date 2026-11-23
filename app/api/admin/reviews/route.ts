import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { reviewSchema } from "@/lib/review-schema";
import { revalidatePublicReviews } from "@/lib/revalidate-reviews";
import {
  createReview,
  readAllReviews,
  ReviewsUnavailableError,
} from "@/lib/reviews-store";

function failure(error: unknown, fallback: string) {
  if (error instanceof ReviewsUnavailableError) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
  console.error(fallback, error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : fallback },
    { status: 500 },
  );
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await readAllReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    return failure(error, "Could not load reviews");
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the review fields", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const review = await createReview(parsed.data);
    revalidatePublicReviews();
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    return failure(error, "Could not save review");
  }
}
