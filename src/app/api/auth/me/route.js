import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// GET /api/auth/me
// Mengembalikan session user yang sedang login (tanpa data sensitif)
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      userId: session.userId,
      name: session.name,
      email: session.email,
      image: session.image,
      role: session.role,
    },
  });
}
