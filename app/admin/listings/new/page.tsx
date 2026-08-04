import Link from "next/link";
import { redirect } from "next/navigation";
import { ListingForm } from "@/components/admin/ListingForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function NewListingPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to listings
        </Link>
        <h1 className="mt-3 font-heading text-3xl text-primary">Add listing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish a property to the public Properties page.
        </p>
      </div>
      <ListingForm mode="create" />
    </div>
  );
}
