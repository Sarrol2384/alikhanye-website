import type { MetadataRoute } from "next";
import { readCachedListings } from "@/lib/listings-store";
import { site } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

function staticLastModified(): Date {
  return new Date(`${site.staticContentUpdated}T00:00:00.000Z`);
}

function listingLastModified(updatedAt?: string): Date {
  if (updatedAt) {
    const parsed = new Date(updatedAt);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return staticLastModified();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticRoutes = [
    "",
    "/about",
    "/properties",
    "/tools",
    "/tools/bond-calculator",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: staticLastModified(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const listings = await readCachedListings();
  const propertyRoutes = listings.map((listing) => ({
    url: `${siteUrl}/properties/${listing.id}`,
    lastModified: listingLastModified(listing.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
