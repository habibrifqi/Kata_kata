import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const LOGIN_PAGE = "/login/oke";

// ─── Route yang bebas diakses tanpa login ────────────────────────────────────
const PUBLIC_ROUTES = [
  "/login/oke",
  "/api/auth/google",
  "/api/auth/google/callback",
];

// ─── Route yang hanya bisa diakses role admin & superadmin ──────────────────
const ADMIN_ONLY_ROUTES = ["/dashboard/categories"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Izinkan semua route publik (termasuk prefiks /api/auth/)
  const isPublicRoute =
    PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r)) ||
    pathname.startsWith("/api/auth/");

  // Baca & decrypt session dari cookie
  const sessionToken = request.cookies.get("kk_session")?.value;
  const session = sessionToken ? await decrypt(sessionToken) : null;

  // ── Redirect ke login jika belum authenticated & bukan public route ────────
  if (!isPublicRoute && !session) {
    // const url = new URL(LOGIN_PAGE, request.url);
    // return NextResponse.redirect(url);

    // jika tidak ada halaman yg cocok dan tidak login maka biarkan
    return NextResponse.next();
  }

  // ── Jika sudah login & mengakses halaman login → redirect ke dashboard ─────
  if (pathname === LOGIN_PAGE && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Guard khusus: /categories hanya untuk admin & superadmin ───────────────
  const isAdminOnlyRoute = ADMIN_ONLY_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );

  if (isAdminOnlyRoute && session) {
    const allowedRoles = ["admin", "superadmin"];
    if (!allowedRoles.includes(session.role)) {
      // Redirect ke dashboard dengan pesan forbidden
      const url = new URL("/dashboard?error=forbidden", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Proxy berjalan di semua route kecuali static files & Next.js internals
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
