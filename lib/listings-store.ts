import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";
import type { Property, PropertyStatus } from "@/lib/properties";

const DATA_PATH = path.join(process.cwd(), "data", "listings.json");

export type ListingInput = {
  title: string;
  suburb: string;
  price: string;
  beds: number;
  baths: number;
  parking: number;
  description: string;
  images: string[];
  status: PropertyStatus;
  featured: boolean;
};

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];

export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || `listing-${Date.now()}`;
}

function rowToProperty(row: ListingRow): Property {
  return {
    id: row.id,
    type: "sale",
    title: row.title,
    suburb: row.suburb,
    price: row.price,
    beds: row.beds,
    baths: row.baths,
    parking: row.parking,
    description: row.description,
    images: Array.isArray(row.images) ? row.images : [],
    status: row.status,
    featured: row.featured,
  };
}

function inputToRow(id: string, input: ListingInput): Database["public"]["Tables"]["listings"]["Insert"] {
  return {
    id,
    type: "sale",
    title: input.title,
    suburb: input.suburb,
    price: input.price,
    beds: input.beds,
    baths: input.baths,
    parking: input.parking,
    description: input.description,
    images: input.images,
    status: input.status,
    featured: input.featured,
    updated_at: new Date().toISOString(),
  };
}

function supabaseSetupHint(error: { message: string; code?: string }): string {
  if (
    error.message.includes("Could not find the table") ||
    error.message.includes("relation") ||
    error.code === "PGRST205"
  ) {
    return `${error.message}. Run supabase/migrations/001_listings.sql in the Supabase SQL Editor, or npm run db:setup with SUPABASE_DB_URL.`;
  }
  return error.message;
}

async function readListingsFromSupabase(): Promise<Property[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(supabaseSetupHint(error));
  }

  return (data ?? []).map(rowToProperty);
}

async function getListingByIdFromSupabase(id: string): Promise<Property | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(supabaseSetupHint(error));
  }

  return data ? rowToProperty(data) : null;
}

async function createListingInSupabase(input: ListingInput): Promise<Property> {
  const supabase = createSupabaseAdmin();
  let id = slugifyTitle(input.title);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await supabase
      .from("listings")
      .insert(inputToRow(id, input))
      .select("*")
      .single();

    if (!error && data) {
      return rowToProperty(data);
    }

    if (error?.code === "23505") {
      id = `${slugifyTitle(input.title)}-${Date.now().toString(36)}`;
      continue;
    }

    throw new Error(supabaseSetupHint(error ?? { message: "Insert failed" }));
  }

  throw new Error("Could not create listing");
}

async function updateListingInSupabase(
  id: string,
  input: ListingInput,
): Promise<Property | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("listings")
    .update(inputToRow(id, input))
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(supabaseSetupHint(error));
  }

  return data ? rowToProperty(data) : null;
}

async function deleteListingFromSupabase(id: string): Promise<boolean> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    throw new Error(supabaseSetupHint(error));
  }

  return (data?.length ?? 0) > 0;
}

async function ensureFileStore(): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, "[]\n", "utf8");
  }
}

async function readListingsFromFile(): Promise<Property[]> {
  await ensureFileStore();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as Array<Property & { shortDescription?: string }>;
  if (!Array.isArray(parsed)) return [];

  return parsed.map((listing) => {
    const { shortDescription: _short, ...rest } = listing;
    return {
      ...rest,
      description: rest.description || _short || "",
    };
  });
}

async function writeListingsToFile(listings: Property[]): Promise<void> {
  await ensureFileStore();
  await fs.writeFile(DATA_PATH, `${JSON.stringify(listings, null, 2)}\n`, "utf8");
}

export async function readListings(): Promise<Property[]> {
  if (isSupabaseConfigured()) {
    return readListingsFromSupabase();
  }
  return readListingsFromFile();
}

export async function getListingById(id: string): Promise<Property | null> {
  if (isSupabaseConfigured()) {
    return getListingByIdFromSupabase(id);
  }

  const listings = await readListingsFromFile();
  return listings.find((listing) => listing.id === id) ?? null;
}

export async function createListing(input: ListingInput): Promise<Property> {
  if (isSupabaseConfigured()) {
    return createListingInSupabase(input);
  }

  const listings = await readListingsFromFile();
  let id = slugifyTitle(input.title);
  if (listings.some((listing) => listing.id === id)) {
    id = `${id}-${Date.now().toString(36)}`;
  }

  const listing: Property = {
    id,
    type: "sale",
    ...input,
  };

  listings.unshift(listing);
  await writeListingsToFile(listings);
  return listing;
}

export async function updateListing(
  id: string,
  input: ListingInput,
): Promise<Property | null> {
  if (isSupabaseConfigured()) {
    return updateListingInSupabase(id, input);
  }

  const listings = await readListingsFromFile();
  const index = listings.findIndex((listing) => listing.id === id);
  if (index === -1) return null;

  const updated: Property = {
    id,
    type: "sale",
    ...input,
  };
  listings[index] = updated;
  await writeListingsToFile(listings);
  return updated;
}

export async function deleteListing(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    return deleteListingFromSupabase(id);
  }

  const listings = await readListingsFromFile();
  const next = listings.filter((listing) => listing.id !== id);
  if (next.length === listings.length) return false;
  await writeListingsToFile(next);
  return true;
}
