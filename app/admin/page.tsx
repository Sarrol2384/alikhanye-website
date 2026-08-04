import { redirect } from "next/navigation";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readListings } from "@/lib/listings-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const listings = await readListings();
  return <ListingsTable listings={listings} />;
}
