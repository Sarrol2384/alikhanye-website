/**
 * Property listing types + helpers.
 * Listings are stored in Supabase (production) or `data/listings.json` locally.
 */

export type PropertyStatus = "available" | "sold" | "pending";

export type Property = {
  id: string;
  title: string;
  suburb: string;
  price: string;
  beds: number;
  baths: number;
  parking: number;
  type: "sale";
  description: string;
  images: string[];
  status: PropertyStatus;
  featured: boolean;
};

export function statusLabel(status: PropertyStatus): string {
  switch (status) {
    case "available":
      return "Available";
    case "sold":
      return "Sold";
    case "pending":
      return "Pending";
  }
}
