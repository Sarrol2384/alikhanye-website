import "server-only";

import { promises as fs } from "fs";
import path from "path";
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

async function ensureStore(): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, "[]\n", "utf8");
  }
}

export async function readListings(): Promise<Property[]> {
  await ensureStore();
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

async function writeListings(listings: Property[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(DATA_PATH, `${JSON.stringify(listings, null, 2)}\n`, "utf8");
}

export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || `listing-${Date.now()}`;
}

export async function getListingById(id: string): Promise<Property | null> {
  const listings = await readListings();
  return listings.find((listing) => listing.id === id) ?? null;
}

export async function createListing(input: ListingInput): Promise<Property> {
  const listings = await readListings();
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
  await writeListings(listings);
  return listing;
}

export async function updateListing(
  id: string,
  input: ListingInput,
): Promise<Property | null> {
  const listings = await readListings();
  const index = listings.findIndex((listing) => listing.id === id);
  if (index === -1) return null;

  const updated: Property = {
    id,
    type: "sale",
    ...input,
  };
  listings[index] = updated;
  await writeListings(listings);
  return updated;
}

export async function deleteListing(id: string): Promise<boolean> {
  const listings = await readListings();
  const next = listings.filter((listing) => listing.id !== id);
  if (next.length === listings.length) return false;
  await writeListings(next);
  return true;
}
