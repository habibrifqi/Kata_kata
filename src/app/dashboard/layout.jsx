import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";

/**
 * Dashboard Layout — Server Component
 *
 * Melindungi SEMUA route di bawah /dashboard.
 * Jika user belum login (tidak ada session), render halaman 404
 * alih-alih redirect ke login.
 */
export default async function DashboardLayout({ children }) {
  const session = await getSession();

  if (!session) {
    notFound();
  }

  return <>{children}</>;
}
