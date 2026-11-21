import { site } from "@/lib/site";

/** Show the "list your property" prompt while the catalogue is this small. */
export const FEW_LISTINGS_THRESHOLD = 3;

const PLACEHOLDER_DESCRIPTION =
  /^(describe property here|describe the property|property description|description here|add description|description|lorem ipsum|todo|tbd|n\/a|na|xxx+|test)[.!\s]*$/i;

export function isPlaceholderDescription(
  value: string | null | undefined,
): boolean {
  const text = value?.replace(/\s+/g, " ").trim() ?? "";
  if (!text) return true;
  return PLACEHOLDER_DESCRIPTION.test(text);
}

/** Real listing copy, or null when the field is empty or still a placeholder. */
export function publicDescription(
  value: string | null | undefined,
): string | null {
  if (isPlaceholderDescription(value)) return null;
  return value?.trim() ?? null;
}

export function hasFewListings(count: number): boolean {
  return count < FEW_LISTINGS_THRESHOLD;
}

type ListingFacts = {
  title: string;
  suburb: string;
  price: string;
  description: string;
};

/** Meta description and structured data. Never repeats placeholder copy. */
export function listingSummary(property: ListingFacts): string {
  const real = publicDescription(property.description);
  if (real) {
    const clean = real.replace(/\s+/g, " ").trim();
    if (clean.length <= 180) return clean;
    return `${clean.slice(0, 177).trimEnd()}…`;
  }

  return `${property.title} in ${property.suburb}, listed at ${property.price}. Ask ${site.name} for the details.`;
}

/** First rand amount in a price string such as "R800 000". Null if there isn't one. */
export function parseZarPrice(price: string): number | null {
  const match = price.replace(/\u00a0/g, " ").match(/(\d[\d\s,]*)/);
  if (!match?.[1]) return null;
  const digits = match[1].replace(/[\s,]/g, "");
  if (!digits) return null;
  const value = Number(digits);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}
