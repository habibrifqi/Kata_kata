// Server Component wrapper untuk categories page
// Berfungsi sebagai second layer defense (setelah proxy.js)
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CategoriesClient from "./CategoriesClient";

const ALLOWED_ROLES = ["admin", "superadmin"];

export default async function CategoriesPage() {
  const session = await getSession();

  // Double-check: jika tidak login atau role tidak cukup
  if (!session || !ALLOWED_ROLES.includes(session.role)) {
    redirect("/dashboard?error=forbidden");
  }

  return <CategoriesClient user={session} />;
}
