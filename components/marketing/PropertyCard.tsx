import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Car } from "lucide-react";
import type { Property } from "@/lib/properties";
import { statusLabel } from "@/lib/properties";
import { cn } from "@/lib/utils";

type PropertyCardProps = {
  property: Property;
  className?: string;
};

export function PropertyCard({ property, className }: PropertyCardProps) {
  const image = property.images[0];

  return (
    <Link
      href={`/properties/${property.id}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-md bg-navy/90 px-2.5 py-1 text-xs font-medium text-primary-foreground">
          {statusLabel(property.status)}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
          {property.suburb}
        </p>
        <h3 className="mt-2 font-heading text-xl leading-snug text-primary group-hover:text-navy">
          {property.title}
        </h3>
        <p className="mt-2 text-lg font-semibold text-primary">
          {property.price}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {property.description}
        </p>

        <ul className="mt-auto flex flex-wrap gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
          <li className="inline-flex items-center gap-1.5">
            <BedDouble className="size-4 text-gold" aria-hidden />
            <span>{property.beds} beds</span>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Bath className="size-4 text-gold" aria-hidden />
            <span>{property.baths} baths</span>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Car className="size-4 text-gold" aria-hidden />
            <span>{property.parking} parking</span>
          </li>
        </ul>
      </div>
    </Link>
  );
}
