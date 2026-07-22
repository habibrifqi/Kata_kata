# 📘 Panduan Setup Prisma di Project Ini

> **Dashboard KataKata** — Next.js 16 + Prisma v7 + Neon PostgreSQL + TypeScript

---

## 🗂️ Daftar Isi

1. [Kenapa ada banyak file Prisma?](#1-kenapa-ada-banyak-file-prisma)
2. [Penjelasan setiap file](#2-penjelasan-setiap-file)
3. [Kenapa pakai Neon Adapter?](#3-kenapa-pakai-neon-adapter)
4. [Alur data dari browser ke database](#4-alur-data-dari-browser-ke-database)
5. [Cara menambah tabel/kolom baru](#5-cara-menambah-tabelkolom-baru)
6. [Cara buat API Route baru](#6-cara-buat-api-route-baru)
7. [Commands yang sering dipakai](#7-commands-yang-sering-dipakai)
8. [Troubleshooting masalah yang pernah terjadi](#8-troubleshooting-masalah-yang-pernah-terjadi)

---

## 1. Kenapa ada banyak file Prisma?

Saat pertama kali melihat struktur project ini, kamu mungkin bingung kenapa ada beberapa file terkait Prisma. Berikut penjelasannya:

```
dashboard_kata_kata/
│
├── .env                   ← File 1: Untuk Prisma CLI (terminal)
├── .env.local             ← File 2: Untuk Next.js runtime (saat app berjalan)
├── prisma.config.ts       ← File 3: Konfigurasi koneksi Prisma v7 (BARU!)
├── prisma/
│   ├── schema.prisma      ← File 4: Definisi tabel/model database
│   └── migrations/        ← File 5: Riwayat perubahan database (auto-generate)
└── src/
    └── lib/
        └── prisma.ts      ← File 6: Instance Prisma Client untuk dipakai di API
```

**Singkatnya:** Prisma v7 memisahkan tanggung jawab setiap file agar lebih jelas dan aman.

---

## 2. Penjelasan setiap file

### 📄 File 1: `.env`

```env
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."
```

**Siapa yang membaca file ini?** → Prisma CLI (program di terminal)

**Kapan dipakai?**

- Saat kamu jalankan `npx prisma migrate dev` di terminal
- Saat kamu jalankan `npx prisma generate` di terminal
- Saat kamu jalankan `npx prisma studio` di terminal

**PENTING:** File ini HANYA untuk perintah-perintah di terminal. Saat aplikasi Next.js berjalan di browser, file ini TIDAK dipakai.

---

### 📄 File 2: `.env.local`

```env
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."
PGHOST="..."
PGUSER="..."
PGPASSWORD="..."
# ... dan semua variabel lainnya
```

**Siapa yang membaca file ini?** → Next.js (framework)

**Kapan dipakai?**

- Saat aplikasi berjalan (`npm run dev` atau `npm run build`)
- Saat API Route kamu dipanggil dari browser
- Saat `process.env.DATABASE_URL` diakses di dalam kode TypeScript/JavaScript

**PENTING:** File ini berisi semua env vars yang dibutuhkan saat aplikasi aktif. `.env.local` LEBIH DIUTAMAKAN daripada `.env` oleh Next.js.

---

### 📄 File 3: `prisma.config.ts`

```typescript
import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Siapa yang membaca file ini?** → Prisma CLI

**Kenapa ada file ini?** → Ini adalah **PERUBAHAN BESAR di Prisma v7**.

Di versi Prisma sebelumnya (v5, v6), URL database ditaruh langsung di `schema.prisma`:

```prisma
// Cara LAMA (Prisma v5/v6) — TIDAK BERLAKU LAGI di v7
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ← ini sudah dihapus di v7!
}
```

Di Prisma v7, URL database dipindah ke `prisma.config.ts`. Inilah alasannya:

- Lebih fleksibel — bisa pakai logika TypeScript
- Lebih aman — bisa validate env vars sebelum connect
- Import `dotenv/config` agar Prisma CLI bisa baca file `.env`

---

### 📄 File 4: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // URL tidak lagi di sini sejak Prisma v7!
}

model Category {
  id          Int             @id @default(autoincrement())
  name        String          @unique
  colorBg     String          @default("bg-primary")
  glowColor   String          @default("rgba(192, 193, 255, 0.6)")
  quotesCount Int             @default(0)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  quotes      QuoteCategory[]

  @@map("categories")
}

model Quote {
  id             Int             @id @default(autoincrement())
  text           String
  author         String
  role           String?          // tanda ? = boleh kosong (nullable)
  isFavorite     Boolean         @default(false)
  avatarGradient String?
  avatarInitials String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  categories     QuoteCategory[]

  @@map("quotes")
}

model QuoteCategory {
  quoteId    Int
  categoryId Int
  quote      Quote    @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([quoteId, categoryId])
  @@map("quote_categories")
}
```

**Siapa yang membaca file ini?** → Prisma CLI + Prisma Client

**Apa isinya?**

- `generator client` → instruksi untuk generate kode TypeScript otomatis
- `datasource db` → jenis database (postgresql)
- `model` → definisi tabel dan kolom

**Penjelasan sintaks:**
| Sintaks | Artinya |
|---|---|
| `@id` | Primary key |
| `@default(autoincrement())` | Auto-increment (1, 2, 3, ...) |
| `@unique` | Nilai harus unik (tidak boleh duplikat) |
| `@default(now())` | Default value = waktu sekarang |
| `@updatedAt` | Otomatis update saat data diubah |
| `String?` | Tanda `?` = nullable (boleh kosong) |
| `@@map("nama_tabel")` | Nama tabel di database |

---

### 📄 File 5: `prisma/migrations/`

```
prisma/migrations/
└── 20260721080500_init/
    └── migration.sql       ← SQL yang dijalankan ke database
```

**Siapa yang membuat file ini?** → Dibuat OTOMATIS oleh Prisma CLI

**Isinya apa?** File SQL murni yang berisi perintah `CREATE TABLE`, `ALTER TABLE`, dll.

**JANGAN edit file ini secara manual!** Biarkan Prisma yang generate.

Contoh isi `migration.sql` yang dibuat otomatis:

```sql
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "colorBg" TEXT NOT NULL DEFAULT 'bg-primary',
    ...
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
```

---

### 📄 File 6: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// WebSocket untuk Node.js runtime
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = require("ws");
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

// Singleton: satu instance untuk seluruh aplikasi
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

**Siapa yang membaca file ini?** → API Routes kamu

**Kenapa perlu file ini?**

Tanpa file ini, setiap API Route akan membuat koneksi baru ke database setiap kali dipanggil. Bayangkan 100 request per detik = 100 koneksi database yang dibuka secara bersamaan. Ini akan crash!

File ini memastikan **hanya 1 koneksi (instance) yang dipakai seluruh aplikasi**.

**Kenapa ada `PrismaNeon` adapter?**

Ini perubahan di Prisma v7 — koneksi ke database tidak lagi dilakukan secara langsung, tapi harus melalui "driver adapter". Karena kita pakai Neon PostgreSQL (serverless), kita pakai `PrismaNeon` dari package `@prisma/adapter-neon`.

---

## 3. Kenapa pakai Neon Adapter?

### Diagram perbandingan:

```
Cara lama (Prisma v5/v6):
  API Route → PrismaClient → TCP Connection → PostgreSQL

Cara baru (Prisma v7 + Neon):
  API Route → PrismaClient → PrismaNeon Adapter → WebSocket → Neon PostgreSQL
```

Neon PostgreSQL adalah **serverless database** yang koneksinya melalui WebSocket (bukan TCP biasa). Ini lebih efisien untuk:

- Aplikasi di Vercel (serverless functions)
- Environment yang tidak punya persistent TCP connection
- Menangani banyak request sekaligus (connection pooling via pgBouncer)

### Packages yang diinstall:

```json
{
  "dependencies": {
    "@prisma/client": "^7.9.0", // ← Prisma Client utama
    "@prisma/adapter-neon": "^7.9.0", // ← Adapter untuk Neon PostgreSQL
    "@neondatabase/serverless": "^1.1.0", // ← Driver Neon serverless
    "ws": "^8.21.1" // ← WebSocket untuk Node.js runtime
  },
  "devDependencies": {
    "prisma": "^7.9.0", // ← Prisma CLI (untuk migrate, generate, dll)
    "@types/ws": "^8.18.1" // ← TypeScript types untuk ws
  }
}
```

---

## 4. Alur data dari browser ke database

```
Browser
  │
  │  GET http://localhost:3000/api/categories
  ▼
Next.js App Router
  │
  │  Routing ke file: src/app/api/categories/route.ts
  ▼
route.ts (export async function GET)
  │
  │  import { prisma } from "@/lib/prisma"
  ▼
src/lib/prisma.ts (Prisma Client instance)
  │
  │  PrismaNeon adapter (WebSocket)
  ▼
Neon PostgreSQL di cloud
  │
  │  SELECT * FROM "categories"
  ▼
Data dikembalikan sebagai JSON
  │
  │  return NextResponse.json({ success: true, data: [...] })
  ▼
Browser menerima response JSON
```

---

## 5. Cara menambah tabel/kolom baru

### Contoh: Menambah kolom `slug` ke tabel `categories`

**Langkah 1:** Edit `prisma/schema.prisma`

```prisma
model Category {
  id          Int             @id @default(autoincrement())
  name        String          @unique
  slug        String?         @unique  // ← tambahkan ini
  colorBg     String          @default("bg-primary")
  glowColor   String          @default("rgba(192, 193, 255, 0.6)")
  quotesCount Int             @default(0)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  quotes      QuoteCategory[]

  @@map("categories")
}
```

**Langkah 2:** Jalankan migration

```bash
npx prisma migrate dev --name add_slug_to_categories
```

Output yang akan muncul:

```
✔ Generated Prisma Client
✔ Applying migration `20260722_add_slug_to_categories`
Your database is now in sync with your schema.
```

**Langkah 3:** TypeScript types otomatis terupdate!

Setelah migrate, kamu sudah bisa pakai `slug` di kode:

```typescript
await prisma.category.create({
  data: {
    name: "Motivasi",
    slug: "motivasi", // ← langsung tersedia tanpa perlu config tambahan
    colorBg: "bg-primary",
  },
});
```

### Contoh: Menambah tabel baru `Author`

**Langkah 1:** Edit `prisma/schema.prisma` — tambah model baru

```prisma
model Author {
  id        Int      @id @default(autoincrement())
  name      String
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("authors")
}
```

**Langkah 2:** Jalankan migration

```bash
npx prisma migrate dev --name add_authors_table
```

**Langkah 3:** Buat API Route baru (lihat bagian 6)

---

## 6. Cara buat API Route baru

### Struktur folder API Route di Next.js

```
src/app/api/
├── categories/
│   ├── route.ts          → /api/categories
│   └── [id]/
│       └── route.ts      → /api/categories/1  (angka 1 bisa diganti berapa saja)
└── quotes/
    ├── route.ts          → /api/quotes
    └── [id]/
        └── route.ts      → /api/quotes/1
```

### Template dasar API Route

Buat file `src/app/api/authors/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/authors — ambil semua data
export async function GET(request: NextRequest) {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: authors,
    });
  } catch (error) {
    console.error("[GET /api/authors] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

// POST /api/authors — buat data baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // ambil data dari request body

    // Validasi sederhana
    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama tidak boleh kosong" },
        { status: 400 },
      );
    }

    const author = await prisma.author.create({
      data: {
        name: body.name.trim(),
        bio: body.bio ?? null,
      },
    });

    return NextResponse.json({ success: true, data: author }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/authors] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat data" },
      { status: 500 },
    );
  }
}
```

### Template untuk route dengan ID

Buat file `src/app/api/authors/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/authors/1
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authorId = parseInt(id, 10);

    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return NextResponse.json(
        { success: false, error: "Author tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: author });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}

// PUT /api/authors/1
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const author = await prisma.author.update({
      where: { id: parseInt(id, 10) },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.bio !== undefined && { bio: body.bio }),
      },
    });

    return NextResponse.json({ success: true, data: author });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal update data" },
      { status: 500 },
    );
  }
}

// DELETE /api/authors/1
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.author.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true, message: "Data dihapus" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal hapus data" },
      { status: 500 },
    );
  }
}
```

---

## 7. Commands yang sering dipakai

```bash
# ─── MIGRATION (ubah schema database) ────────────────────────────

# Buat dan jalankan migration baru setelah edit schema.prisma
npx prisma migrate dev --name nama_perubahan

# Contoh nama yang baik:
npx prisma migrate dev --name add_slug_to_categories
npx prisma migrate dev --name create_authors_table
npx prisma migrate dev --name add_favorite_to_quotes

# Cek status: apakah schema database sudah sinkron?
npx prisma migrate status

# ─── GENERATE CLIENT ──────────────────────────────────────────────

# Regenerate TypeScript types setelah edit schema.prisma
# (biasanya dilakukan otomatis setelah migrate dev)
npx prisma generate

# ─── STUDIO (GUI database) ────────────────────────────────────────

# Buka GUI visual untuk lihat/edit data di browser
# Buka di: http://localhost:5555
npx prisma studio

# ─── VALIDASI ──────────────────────────────────────────────────────

# Cek apakah schema.prisma valid
npx prisma validate
```

---

## 8. Troubleshooting masalah yang pernah terjadi

### ❌ Error: `PrismaClient requires a driver adapter`

```
PrismaClientConstructorValidationError: PrismaClient requires a driver adapter
```

**Penyebab:** Prisma v7 membutuhkan driver adapter, tapi tidak ada yang dipasang.

**Solusi:** Pastikan `src/lib/prisma.ts` menggunakan `PrismaNeon` adapter:

```typescript
import { PrismaNeon } from "@prisma/adapter-neon";
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

---

### ❌ Error: `The datasource.url property is required`

```
Error: The datasource.url property is required in your Prisma config file
```

**Penyebab:** `prisma.config.ts` tidak bisa membaca `DATABASE_URL` dari `.env`.

**Solusi:** Pastikan `prisma.config.ts` mengimport `dotenv/config`:

```typescript
import "dotenv/config"; // ← WAJIB ada!
```

Dan pastikan file `.env` berisi:

```env
DATABASE_URL="postgresql://..."
```

---

### ❌ Error: `url` dan `directUrl` tidak valid di schema.prisma

```
error: The datasource property `url` is no longer supported in schema files
```

**Penyebab:** Kamu masih pakai cara lama (Prisma v5/v6) — URL database di `schema.prisma`.

**Solusi:** Hapus `url` dari `schema.prisma` dan pindah ke `prisma.config.ts`.

Di `schema.prisma` (BENAR untuk v7):

```prisma
datasource db {
  provider = "postgresql"
  // JANGAN taruh url di sini!
}
```

Di `prisma.config.ts`:

```typescript
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!, // ← taruh di sini
  },
});
```

---

### ❌ API berjalan tapi data tidak berubah / cache lama

**Penyebab:** Next.js masih pakai cache build lama (folder `.next`).

**Solusi:**

```bash
# Hentikan server (Ctrl+C), lalu:
rm -rf .next
npm run dev
```

---

### ❌ `npx prisma migrate` tidak membaca DATABASE_URL

**Penyebab:** Variabel environment tidak tersedia saat Prisma CLI berjalan.

**Solusi:** Pastikan file `.env` (bukan `.env.local`) berisi `DATABASE_URL`:

```env
DATABASE_URL="postgresql://..."
```

Dan pastikan `prisma.config.ts` mengimport `dotenv/config`:

```typescript
import "dotenv/config";
```

---

## 📋 Checklist Setup Ulang (jika project di-clone dari GitHub)

Jika kamu atau orang lain mau menjalankan project ini dari awal:

- [ ] `npm install` — install semua dependencies
- [ ] Buat file `.env` — isi `DATABASE_URL` dan `DATABASE_URL_UNPOOLED`
- [ ] Buat file `.env.local` — isi semua env vars Neon PostgreSQL
- [ ] `npx prisma generate` — generate Prisma Client
- [ ] `npx prisma migrate dev` — jalankan semua migration ke database
- [ ] `npm run dev` — jalankan aplikasi

---

> 📝 **Catatan:** File ini menjelaskan setup Prisma **khusus untuk project ini** yang menggunakan:
>
> - **Prisma v7** (ada breaking change dari v5/v6)
> - **Neon PostgreSQL** (serverless database, perlu WebSocket adapter)
> - **Next.js 16** dengan App Router
> - **TypeScript** untuk file backend
