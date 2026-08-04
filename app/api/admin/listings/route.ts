import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createListing, readListings } from "@/lib/listings-store";

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

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const listings = await readListings();
  return NextResponse.json({ listings });
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

  const parsed = listingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the listing fields", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const listing = await createListing(parsed.data);
  return NextResponse.json({ listing }, { status: 201 });
}
