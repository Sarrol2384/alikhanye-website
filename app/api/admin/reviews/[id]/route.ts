import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { reviewPublishSchema, reviewSchema } from "@/lib/review-schema";
import { revalidatePublicReviews } from "@/lib/revalidate-reviews";
import {
  deleteReview,
  getReviewById,
  ReviewsUnavailableError,
  setReviewPublished,
  updateReview,
} from "@/lib/reviews-store";

const idSchema = z.string().uuid();

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function GET(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  try {
    const review = await getReviewById(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ review });
  } catch (error) {
    return failure(error, "Could not load review");
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
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
    const review = await updateReview(id, parsed.data);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    revalidatePublicReviews();
    return NextResponse.json({ review });
  } catch (error) {
    return failure(error, "Could not save review");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reviewPublishSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the publish field" }, { status: 400 });
  }

  try {
    const review = await setReviewPublished(id, parsed.data.published);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    revalidatePublicReviews();
    return NextResponse.json({ review });
  } catch (error) {
    return failure(error, "Could not update the review");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  try {
    const ok = await deleteReview(id);
    if (!ok) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    revalidatePublicReviews();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return failure(error, "Could not delete the review");
  }
}
