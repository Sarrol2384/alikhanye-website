import { listingSummary, parseZarPrice } from "@/lib/listing-copy";
import type { Property } from "@/lib/properties";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

function availability(status: Property["status"]): string {
  switch (status) {
    case "sold":
      return "https://schema.org/SoldOut";
    case "pending":
      return "https://schema.org/PreOrder";
    case "available":
      return "https://schema.org/InStock";
  }
}

export function ListingJsonLd({ property }: { property: Property }) {
  const url = `${getSiteUrl()}/properties/${property.id}`;
  const price = parseZarPrice(property.price);
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url,
    priceCurrency: "ZAR",
    availability: availability(property.status),
  };
  if (price != null) offer.price = price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: listingSummary(property),
    url,
    image: property.images.map((src) => absoluteUrl(src)),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.suburb,
      addressRegion: "Western Cape",
      addressCountry: "ZA",
    },
    offers: offer,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
