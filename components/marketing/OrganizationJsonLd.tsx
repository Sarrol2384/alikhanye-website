import { complianceLines, site } from "@/lib/site";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import { readCachedPublishedReviews } from "@/lib/reviews-store";

export async function OrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  const ffc = complianceLines().find((line) => line.label === "FFC");
  const reviews = await readCachedPublishedReviews();
  const aggregateRating =
    reviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue:
            Math.round(
              (reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length) *
                10,
            ) / 10,
          reviewCount: reviews.length,
          bestRating: 5,
          worstRating: 1,
        }
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: site.name,
    description: site.description,
    slogan: site.slogan,
    url: siteUrl,
    email: site.email,
    telephone: site.phoneTel,
    image: absoluteUrl("/brand/logo.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.addressLocality,
      postalCode: site.postalCode,
      addressRegion: site.addressRegion,
      addressCountry: "ZA",
    },
    areaServed: site.areaServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    founder: {
      "@type": "Person",
      name: site.principal,
    },
    identifier: [
      {
        "@type": "PropertyValue",
        name: "Company registration",
        value: site.registration,
      },
      ...(ffc
        ? [
            {
              "@type": "PropertyValue",
              name: "FFC",
              value: ffc.value,
            },
          ]
        : []),
    ],
    ...(aggregateRating ? { aggregateRating } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
