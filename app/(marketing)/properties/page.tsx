import { ListPropertyCta } from "@/components/marketing/ListPropertyCta";
import { PropertyCard } from "@/components/marketing/PropertyCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { hasFewListings } from "@/lib/listing-copy";
import { readCachedListings } from "@/lib/listings-store";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Properties",
  description: `Homes for sale with ${site.name} in Blue Downs, Eerste River, Kuils River and nearby suburbs.`,
  path: "/properties",
});

export default async function PropertiesPage() {
  const properties = await readCachedListings();

  return (
    <section className="bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="For sale"
          title="Properties"
          description="Homes currently listed in Blue Downs and the surrounding suburbs. Enquire on any property and Wendy will get back to you."
        />

        {properties.length === 0 ? (
          <div className="mt-14">
            <ListPropertyCta count={0} />
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

        {properties.length > 0 && hasFewListings(properties.length) ? (
          <div className="mt-14">
            <ListPropertyCta count={properties.length} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
