# Dokumentasi Proyek — KataKata (Dashboard)

Ringkasan singkat dari struktur, stack, cara menjalankan, dan titik masuk penting kode.

## Gambaran Umum
- Nama: KataKata — Curation Hub Dashboard
- Tujuan: Panel admin untuk mengelola kutipan (*quotes*), kategori, penulis, dan pengguna.

## Tech Stack
- Framework: Next.js 16 (App Router)
- UI: React 19, Tailwind CSS v4
- Database: PostgreSQL via Prisma (Prisma v7+)
- Auth: Google OAuth (custom routes under `src/app/api/auth`)
- Lainnya: `tesseract.js`, `ws`, `jose`, `lucide-react`

Lihat `package.json` untuk dependensi: [package.json](package.json)

## Menjalankan Lokal
1. Install dependensi

```bash
npm install
```

2. Siapkan environment variables (contoh minimal di `.env`):

```text
DATABASE_URL="postgresql://..."
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

3. Mode development

```bash
npm run dev
```

4. Build & start production

```bash
npm run build
npm run start
```

## Database & Prisma
- Skema utama: [prisma/schema.prisma](prisma/schema.prisma)
- Perintah umum:

```bash
npx prisma migrate dev     # jalankan migrasi (development)
npx prisma db push         # sinkronisasi skema (opsional)
npx prisma generate        # generate client (build script juga memanggil ini)
```

## API Routes (Ringkasan)
Semua route berada di App Router under `src/app/api`.

- Auth:
  - `/api/auth/google` (oauth redirect) — [src/app/api/auth/google/route.js](src/app/api/auth/google/route.js)
  - `/api/auth/google/callback` — [src/app/api/auth/google/callback/route.js](src/app/api/auth/google/callback/route.js)
  - `/api/auth/logout` — [src/app/api/auth/logout/route.js](src/app/api/auth/logout/route.js)
  - `/api/auth/me` — [src/app/api/auth/me/route.js](src/app/api/auth/me/route.js)

- Authors:
  - `/api/authors` — [src/app/api/authors/route.ts](src/app/api/authors/route.ts)
  - `/api/authors/[id]` — [src/app/api/authors/[id]/route.ts](src/app/api/authors/[id]/route.ts)

- Categories:
  - `/api/categories` — [src/app/api/categories/route.ts](src/app/api/categories/route.ts)
  - `/api/categories/[id]` — [src/app/api/categories/[id]/route.ts](src/app/api/categories/[id]/route.ts)

- Quotes:
  - `/api/quotes` — [src/app/api/quotes/route.ts](src/app/api/quotes/route.ts)
  - `/api/quotes/[id]` — [src/app/api/quotes/[id]/route.ts](src/app/api/quotes/[id]/route.ts)

- Users:
  - `/api/users` — [src/app/api/users/route.ts](src/app/api/users/route.ts)
  - `/api/users/[id]` — [src/app/api/users/[id]/route.ts](src/app/api/users/[id]/route.ts)

Gunakan link file di atas untuk melihat implementasi handler dan shape request/response.

## Frontend (App Router) — Struktur Ringkas
- Root app: [src/app/layout.jsx](src/app/layout.jsx) dan [src/app/page.jsx](src/app/page.jsx)
- Dashboard routes: [src/app/dashboard](src/app/dashboard)
  - Halaman: `page.jsx`, `authors/page.jsx`, `categories/page.jsx`, `quotes/page.jsx`, `users/page.jsx`
- Komponen utama: `src/components`
  - Layout: [src/components/layout](src/components/layout)
  - Dashboard widgets: [src/components/dashboard](src/components/dashboard)
  - Quotes: [src/components/quotes](src/components/quotes)
  - UI helpers: [src/components/ui](src/components/ui)

## File Penting
- [package.json](package.json) — skrip & dependensi
- [README.md](README.md) — ringkasan proyek (ada di repo)
- [prisma/schema.prisma](prisma/schema.prisma) — skema DB
- [src/lib/prisma.ts](src/lib/prisma.ts) — Prisma client wrapper
- [src/lib/session.js](src/lib/session.js) atau [src/lib/useCurrentUser.js](src/lib/useCurrentUser.js) — helper session/user

## Deployment
- Aplikasi Next.js; deploy ke Vercel atau server yang mendukung Node.js. Pastikan environment variables dan database (Postgres) tersedia.
- Build pipeline: `npm run build` (sudah menjalankan `prisma generate`).

## Kontribusi & Catatan
- Gunakan branch dan PR untuk fitur/bugfix.
- Ikuti style linting lewat `npm run lint`.

---
Jika Anda ingin, saya bisa:
- menambahkan bagian API detail (request/response contoh),
- membuat checklist deployment ke Vercel/Docker,
- atau mengubah dokumentasi ke bahasa Inggris.
