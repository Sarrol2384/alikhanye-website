import "server-only";

import { unstable_cache } from "next/cache";
import {
  REVIEWS_CACHE_TAG,
  REVIEWS_REVALIDATE_SECONDS,
} from "@/lib/reviews-cache";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  createSupabaseAnon,
  isSupabaseAnonConfigured,
} from "@/lib/supabase/public";
import type { Database } from "@/lib/supabase/types";

export type Review = {
  id: string;
  clientName: string;
  suburb: string | null;
  rating: number;
  comment: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewInput = {
  clientName: string;
  suburb: string;
  rating: number;
  comment: string;
  published: boolean;
  sortOrder: number;
};

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export class ReviewsUnavailableError extends Error {
  reason: "not_configured" | "missing_table";

  constructor(reason: "not_configured" | "missing_table", message: string) {
    super(message);
    this.name = "ReviewsUnavailableError";
    this.reason = reason;
  }
}

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    clientName: row.client_name,
    suburb: row.suburb?.trim() ? row.suburb.trim() : null,
    rating: row.rating,
    comment: row.comment,
    published: row.published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToRow(
  input: ReviewInput,
): Database["public"]["Tables"]["reviews"]["Insert"] {
  const suburb = input.suburb.trim();
  return {
    client_name: input.clientName.trim(),
    suburb: suburb.length > 0 ? suburb : null,
    rating: input.rating,
    comment: input.comment.trim(),
    published: input.published,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

function errorText(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "";
}

function errorCode(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return "";
}

export function isMissingReviewsTable(error: unknown): boolean {
  const code = errorCode(error);
  const message = errorText(error).toLowerCase();
  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("could not find the table") ||
    (message.includes("schema cache") && message.includes("reviews")) ||
    (message.includes("relation") && message.includes("reviews"))
  );
}

function reviewsSetupMessage(): string {
  return "The reviews table is not in Supabase yet. Run supabase/migrations/002_reviews.sql in the SQL Editor for alikhanye-project.";
}

function throwIfUnavailable(error: unknown): never {
  if (isMissingReviewsTable(error)) {
    throw new ReviewsUnavailableError("missing_table", reviewsSetupMessage());
  }
  throw new Error(errorText(error) || "Could not use the reviews table");
}

async function readPublishedFromDatabase(): Promise<Review[]> {
  const supabase = isSupabaseAnonConfigured()
    ? createSupabaseAnon()
    : createSupabaseAdmin();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(rowToReview);
}

/** Published reviews for the public site. A missing table returns an empty list. */
export async function readPublishedReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured() && !isSupabaseAnonConfigured()) {
    return [];
  }

  try {
    return await readPublishedFromDatabase();
  } catch (error) {
    console.error(
      "Published reviews could not be loaded:",
      errorText(error) || error,
    );
    return [];
  }
}

export async function readAllReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) {
    throw new ReviewsUnavailableError(
      "not_configured",
      "Supabase is not configured, so reviews cannot be saved yet.",
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throwIfUnavailable(error);
  }

  return (data ?? []).map(rowToReview);
}

export async function getReviewById(id: string): Promise<Review | null> {
  if (!isSupabaseConfigured()) {
    throw new ReviewsUnavailableError(
      "not_configured",
      "Supabase is not configured, so reviews cannot be saved yet.",
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throwIfUnavailable(error);
  }

  return data ? rowToReview(data) : null;
}

export async function createReview(input: ReviewInput): Promise<Review> {
  if (!isSupabaseConfigured()) {
    throw new ReviewsUnavailableError(
      "not_configured",
      "Supabase is not configured, so reviews cannot be saved yet.",
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("reviews")
    .insert(inputToRow(input))
    .select("*")
    .single();

  if (error || !data) {
    throwIfUnavailable(error ?? { message: "Insert failed" });
  }

  return rowToReview(data);
}

export async function updateReview(
  id: string,
  input: ReviewInput,
): Promise<Review | null> {
  if (!isSupabaseConfigured()) {
    throw new ReviewsUnavailableError(
      "not_configured",
      "Supabase is not configured, so reviews cannot be saved yet.",
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("reviews")
    .update(inputToRow(input))
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throwIfUnavailable(error);
  }

  return data ? rowToReview(data) : null;
}

export async function setReviewPublished(
  id: string,
  published: boolean,
): Promise<Review | null> {
  if (!isSupabaseConfigured()) {
    throw new ReviewsUnavailableError(
      "not_configured",
      "Supabase is not configured, so reviews cannot be saved yet.",
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("reviews")
    .update({
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throwIfUnavailable(error);
  }

  return data ? rowToReview(data) : null;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new ReviewsUnavailableError(
      "not_configured",
      "Supabase is not configured, so reviews cannot be saved yet.",
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    throwIfUnavailable(error);
  }

  return (data?.length ?? 0) > 0;
}

export const readCachedPublishedReviews = unstable_cache(
  async () => readPublishedReviews(),
  ["public-reviews"],
  {
    revalidate: REVIEWS_REVALIDATE_SECONDS,
    tags: [REVIEWS_CACHE_TAG],
  },
);
