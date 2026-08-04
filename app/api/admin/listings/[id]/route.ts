import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import {
  deleteListing,
  getListingById,
  updateListing,
} from "@/lib/listings-store";

const listingSchema = z.object({
  title: z.string().trim().min(3).max(160),
  suburb: z.string().trim().min(2).max(80),
  price: z.string().trim().min(1).max(40),
  beds: z.coerce.number().int().min(0).max(50),
  baths: z.coerce.number().int().min(0).max(50),
  parking: z.coerce.number().int().min(0).max(50),
  description: z.string().trim().min(10).max(5000),
  images: z.array(z.string().trim().min(1)).min(1).max(12),
  status: z.enum(["available", "sold", "pending"]),
  featured: z.boolean(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const listing = await getListingById(id);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  return NextResponse.json({ listing });
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = listingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the listing fields", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const listing = await updateListing(id, parsed.data);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  return NextResponse.json({ listing });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = await deleteListing(id);
  if (!ok) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
