import { ImageResponse } from "next/og";
import { ShareCard } from "@/components/og/ShareCard";
import { readCachedListing } from "@/lib/listings-store";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

function renderOg(title: string, lines: string[]) {
  return new ImageResponse(
    <ShareCard kicker="ALIKHANYE PROPERTIES" title={title} lines={lines} />,
    { ...ogSize },
  );
}

export function defaultShareImage() {
  return renderOg(site.slogan, [
    "Blue Downs, Eerste River, Kuils River and nearby",
    `${site.phoneDisplay} · ${site.email}`,
  ]);
}

export async function listingShareImage(id: string) {
  const property = await readCachedListing(id);
  if (!property) {
    return renderOg("Listing not on the site", [
      "Ask us about homes in Blue Downs and nearby suburbs",
      site.phoneDisplay,
    ]);
  }

  const facts = [
    property.beds > 0 ? `${property.beds} bed` : null,
    property.baths > 0 ? `${property.baths} bath` : null,
    property.parking > 0 ? `${property.parking} parking` : null,
  ].filter((item): item is string => Boolean(item));

  return renderOg(property.title, [
    `${property.suburb} · ${property.price}`,
    facts.join(" · ") || "For sale",
    `${site.name} · Blue Downs`,
  ]);
}
