import type { Metadata } from "next";
import { PropertyCard } from "@/components/marketing/PropertyCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { LinkButton } from "@/components/ui/link-button";
import { readListings } from "@/lib/listings-store";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Properties",
  description: `Browse homes for sale with ${site.name} in Blue Downs and surrounding Cape Town suburbs.`,
  openGraph: {
    title: `Properties | ${site.name}`,
    description: `Homes for sale in Blue Downs and surrounds — listed by ${site.name}.`,
    locale: "en_ZA",
  },
};

export default async function PropertiesPage() {
  const properties = await readListings();

  return (
    <section className="bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="For sale"
          title="Properties"
          description="Browse current listings across Blue Downs and surrounding areas. Enquire directly on any property for a personal walkthrough."
        />

        {properties.length === 0 ? (
          <div className="mt-14 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <p className="font-heading text-2xl text-primary">
              New listings coming soon
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Looking to buy or sell in Blue Downs and surrounds? Get in touch —
              Wendy will help you take the next step.
            </p>
            <LinkButton href="/contact" variant="accent" className="mt-6">
              Contact us
            </LinkButton>
          </div>
        ) : (
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <li
                key={property.id}
                className="animate-section-reveal"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <PropertyCard property={property} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
