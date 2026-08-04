"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import type { Property } from "@/lib/properties";
import { statusLabel } from "@/lib/properties";

type ListingsTableProps = {
  listings: Property[];
};

export function ListingsTable({ listings }: ListingsTableProps) {
  const router = useRouter();

  async function remove(id: string, title: string) {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/listings/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      toast.error("Could not delete listing");
      return;
    }
    toast.success("Listing deleted");
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Listings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add and manage properties shown on the public website.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/admin/listings/new">Add listing</LinkButton>
          <Button type="button" variant="outline" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-xl text-primary">No listings yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add the client’s first property to show on the site.
          </p>
          <LinkButton href="/admin/listings/new" className="mt-6">
            Add listing
          </LinkButton>
        </div>
      ) : (
        <ul className="space-y-3">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-28">
                {listing.images[0] ? (
                  <Image
                    src={listing.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-primary">
                  {listing.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {listing.suburb} · {listing.price} ·{" "}
                  {statusLabel(listing.status)}
                  {listing.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <LinkButton
                  href={`/properties/${listing.id}`}
                  target="_blank"
                  variant="outline"
                  size="sm"
                >
                  View
                </LinkButton>
                <LinkButton href={`/admin/listings/${listing.id}`} size="sm">
                  Edit
                </LinkButton>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void remove(listing.id, listing.title)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
