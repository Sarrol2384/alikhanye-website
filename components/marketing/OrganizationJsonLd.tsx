import { site } from "@/lib/site";

export function OrganizationJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: site.name,
    description: site.description,
    slogan: site.slogan,
    url: siteUrl,
    email: site.email,
    telephone: site.phoneTel,
    image: `${siteUrl}/brand/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "16 Lilly Kate Crescent",
      addressLocality: "Blue Downs",
      postalCode: "7100",
      addressRegion: "Western Cape",
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
        name: "Company Registration",
        value: site.registration,
      },
      {
        "@type": "PropertyValue",
        name: "FFC",
        value: site.ffc,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
