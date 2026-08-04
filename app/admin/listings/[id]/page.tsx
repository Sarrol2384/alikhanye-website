import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/admin/ListingForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getListingById } from "@/lib/listings-store";

export const dynamic = "force-dynamic";

type EditListingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditListingPage({
  params,
}: EditListingPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to listings
        </Link>
        <h1 className="mt-3 font-heading text-3xl text-primary">Edit listing</h1>
        <p className="mt-1 text-sm text-muted-foreground">{listing.title}</p>
      </div>
      <ListingForm mode="edit" initial={listing} />
    </div>
  );
}
