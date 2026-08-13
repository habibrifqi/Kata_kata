// Server Component wrapper untuk categories page
// Auth guard sudah dihandle oleh parent layout.jsx
// Di sini hanya cek role yang diizinkan
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import CategoriesClient from "./CategoriesClient";

const ALLOWED_ROLES = ["admin", "superadmin"];

export default async function CategoriesPage() {
  const session = await getSession();

  // Jika role tidak cukup, tampilkan 404
  if (!session || !ALLOWED_ROLES.includes(session.role)) {
    notFound();
  }

  return <CategoriesClient user={session} />;
}
