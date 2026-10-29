import { complianceLines, site } from "@/lib/site";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

export function OrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  const ffc = complianceLines().find((line) => line.label === "FFC");

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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
