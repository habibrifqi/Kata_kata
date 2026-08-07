import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

const SUPERADMIN_EMAIL = "bidang3.habibrifqi@gmail.com";
const LOGIN_PAGE = "/login/oke";

// GET /api/auth/google/callback
// Callback dari Google setelah user consent
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Jika user membatalkan login di Google
  if (error) {
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=google_cancelled`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=invalid_callback`, request.url)
    );
  }

  // ── CSRF: Verifikasi state cookie ──────────────────────────────────────────
  const storedState = request.cookies.get("oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=invalid_state`, request.url)
    );
  }

  // ── Exchange code → access_token ───────────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  let googleTokens;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    googleTokens = await tokenRes.json();
  } catch {
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=token_exchange_failed`, request.url)
    );
  }

  if (googleTokens.error) {
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=token_exchange_failed`, request.url)
    );
  }

  // ── Fetch user info dari Google ────────────────────────────────────────────
  let googleUser;
  try {
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${googleTokens.access_token}` },
      }
    );
    googleUser = await userRes.json();
  } catch {
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=userinfo_failed`, request.url)
    );
  }

  if (!googleUser.email) {
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=no_email`, request.url)
    );
  }

  // ── Role Resolution + DB Upsert ────────────────────────────────────────────
  // Logic (dikonfirmasi user):
  // 1. Cek apakah user sudah ada di DB
  // 2. Jika SUDAH ADA → gunakan role dari DB
  // 3. Jika BELUM ADA:
  //    - email === SUPERADMIN_EMAIL → create dengan role superadmin
  //    - email lainnya → create dengan role writer
  let dbUser;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (existingUser) {
      // User sudah ada → update name & image, pertahankan role
      dbUser = await prisma.user.update({
        where: { email: googleUser.email },
        data: {
          name: googleUser.name,
          image: googleUser.picture,
        },
      });
    } else {
      // User belum ada → create baru dengan role yang ditentukan
      const newRole =
        googleUser.email === SUPERADMIN_EMAIL ? "superadmin" : "writer";

      dbUser = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.picture,
          role: newRole,
        },
      });
    }
  } catch (err) {
    console.error("[Auth Callback] DB error:", err);
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=db_error`, request.url)
    );
  }

  // ── Buat session JWT & set cookie ─────────────────────────────────────────
  try {
    await createSession({
      userId: dbUser.id,
      role: dbUser.role,
      name: dbUser.name,
      email: dbUser.email,
      image: dbUser.image,
    });
  } catch (err) {
    console.error("[Auth Callback] Session creation error:", err);
    return NextResponse.redirect(
      new URL(`${LOGIN_PAGE}?error=session_failed`, request.url)
    );
  }

  // ── Hapus state cookie & redirect ke dashboard ────────────────────────────
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.delete("oauth_state");

  return response;
}
