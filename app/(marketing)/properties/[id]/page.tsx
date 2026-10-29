import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Car, MapPin, MessageCircle } from "lucide-react";
import { ListingJsonLd } from "@/components/marketing/ListingJsonLd";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { listingEnquiryMessage, whatsappUrl } from "@/lib/format";
import { listingSummary, publicDescription } from "@/lib/listing-copy";
import { readCachedListing, readCachedListings } from "@/lib/listings-store";
import { pageMetadata } from "@/lib/metadata";
import { statusLabel } from "@/lib/properties";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const listings = await readCachedListings();
  return listings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await readCachedListing(id);
  if (!property) {
    return { title: "Property not found" };
  }

  return pageMetadata({
    title: property.title,
    description: listingSummary(property),
    path: `/properties/${property.id}`,
    shareImage: "segment",
  });
}

export default async function PropertyDetailPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;
  const property = await readCachedListing(id);
  if (!property) notFound();

  const description = publicDescription(property.description);
  const enquireMessage = listingEnquiryMessage(property);
  const heroImage = property.images[0];
  const gallery = property.images.slice(1);

  return (
    <>
      <ListingJsonLd property={property} />
      <section className="relative min-h-[42vh] overflow-hidden bg-navy sm:min-h-[50vh]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${property.title} in ${property.suburb}`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/25"
          aria-hidden
        />
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-6 py-12 sm:min-h-[50vh] sm:px-8 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {property.suburb} · {statusLabel(property.status)}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl leading-tight break-words text-primary-foreground sm:text-5xl">
            {property.title}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-gold sm:text-3xl">
            {property.price}
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Overview"
              title="Property details"
            />
            {description ? (
              <p className="animate-section-reveal mt-8 text-base leading-relaxed whitespace-pre-line text-muted-foreground">
                {description}
              </p>
            ) : (
              <p className="animate-section-reveal mt-8 text-base leading-relaxed text-muted-foreground">
                The write-up for this home isn&apos;t on the site yet. Phone or
                WhatsApp us and we&apos;ll tell you more about it.
              </p>
            )}

            {gallery.length > 0 ? (
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {gallery.map((src, index) => (
                  <li
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
                  >
                    <Image
                      src={src}
                      alt={`${property.title} in ${property.suburb}, photo ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 40vw"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <aside className="animate-section-reveal h-fit rounded-xl border border-border bg-card p-6 sm:p-7">
            <h2 className="font-heading text-2xl text-primary">Key facts</h2>
            <ul className="mt-6 space-y-4 text-sm text-foreground">
              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-gold" aria-hidden />
                <span>{property.suburb}</span>
              </li>
              <li className="flex items-center gap-3">
                <BedDouble className="size-4 shrink-0 text-gold" aria-hidden />
                <span>{property.beds} bedrooms</span>
              </li>
              <li className="flex items-center gap-3">
                <Bath className="size-4 shrink-0 text-gold" aria-hidden />
                <span>{property.baths} bathrooms</span>
              </li>
              <li className="flex items-center gap-3">
                <Car className="size-4 shrink-0 text-gold" aria-hidden />
                <span>{property.parking} parking</span>
              </li>
              <li className="border-t border-border pt-4 text-muted-foreground">
                Type: For sale · Status: {statusLabel(property.status)}
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <LinkButton
                href={`/contact?property=${encodeURIComponent(property.title)}&price=${encodeURIComponent(property.price)}`}
                variant="accent"
                size="lg"
                className="cta-lift h-auto min-h-11 w-full justify-center px-4 py-3 whitespace-normal"
              >
                Enquire about this property
              </LinkButton>
              <a
                href={whatsappUrl(site.whatsapp, enquireMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "cta-lift h-auto min-h-11 w-full justify-center px-4 py-3 whitespace-normal",
                )}
              >
                <MessageCircle className="mr-2 size-4" />
                WhatsApp about this property
              </a>
              <Link
                href="/properties"
                className="pt-1 text-center text-sm font-medium text-muted-foreground hover:text-primary"
              >
                ← Back to all properties
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
