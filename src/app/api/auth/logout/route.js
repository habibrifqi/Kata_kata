import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

// POST /api/auth/logout
// Hapus session cookie dan redirect ke halaman login
export async function POST(request) {
  await deleteSession();

  return NextResponse.redirect(new URL("/login/oke", request.url));
}
