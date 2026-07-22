# 📚 Tutorial Prisma ORM + Next.js API Routes
### Untuk yang sudah terbiasa Laravel

---

## 🧠 Analogi: Laravel vs Next.js + Prisma

Kalau kamu sudah paham Laravel, ini padanan konsepnya:

| Laravel | Next.js + Prisma | Fungsi |
|---|---|---|
| `php artisan migrate` | `npx prisma migrate dev` | Buat/update tabel di database |
| `php artisan make:model` | Edit `schema.prisma` | Definisi model/tabel |
| Eloquent Model (`User::find(1)`) | Prisma Client (`prisma.user.findUnique(...)`) | Query database |
| `routes/api.php` | `src/app/api/.../route.ts` | Definisi URL endpoint API |
| Controller | `route.ts` (fungsi GET/POST/PUT/DELETE) | Logika request & response |
| `.env` | `.env` / `.env.local` | Konfigurasi environment |

---

## 📁 Struktur File di Project Ini

```
dashboard_kata_kata/
│
├── prisma/
│   ├── schema.prisma          ← Seperti "migration file" tapi versi deklaratif
│   └── migrations/            ← File SQL hasil migrasi (auto-generate)
│
├── prisma.config.ts           ← Konfigurasi koneksi database (Prisma v7)
├── .env                       ← DATABASE_URL untuk Prisma CLI
├── .env.local                 ← Semua env vars untuk Next.js (runtime)
│
└── src/
    ├── lib/
    │   └── prisma.ts          ← "Instance" Prisma Client (seperti DB facade Laravel)
    ├── types/
    │   └── index.ts           ← TypeScript types (seperti Laravel Resource/DTO)
    └── app/
        └── api/
            ├── categories/
            │   ├── route.ts          ← /api/categories (GET list, POST create)
            │   └── [id]/route.ts     ← /api/categories/1 (GET, PUT, DELETE)
            └── quotes/
                ├── route.ts          ← /api/quotes
                └── [id]/route.ts     ← /api/quotes/1
```

---

## 🗄️ Bagian 1: Schema Prisma (Seperti Migration Laravel)

Di Laravel kamu menulis:
```php
// database/migrations/create_categories_table.php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->string('color_bg')->default('bg-primary');
    $table->timestamps();
});
```

Di Prisma kamu menulis di `prisma/schema.prisma`:
```prisma
model Category {
  id        Int      @id @default(autoincrement())  // ← seperti $table->id()
  name      String   @unique                         // ← seperti ->unique()
  colorBg   String   @default("bg-primary")          // ← seperti ->default()
  createdAt DateTime @default(now())                 // ← seperti timestamps()
  updatedAt DateTime @updatedAt

  @@map("categories")  // ← nama tabel di database
}
```

Lalu jalankan:
```bash
npx prisma migrate dev --name nama_perubahan
```
> Ini sama seperti `php artisan migrate` di Laravel ✅

---

## 🔧 Bagian 2: Prisma Client (Seperti Eloquent)

Di Laravel:
```php
$categories = Category::all();
$category   = Category::find(1);
$new        = Category::create(['name' => 'Motivasi']);
```

Di Prisma (`src/lib/prisma.ts` adalah "instance"-nya):
```typescript
import { prisma } from "@/lib/prisma";

// Ambil semua data
const categories = await prisma.category.findMany();

// Ambil satu data by ID
const category = await prisma.category.findUnique({
  where: { id: 1 }
});

// Buat data baru
const newCategory = await prisma.category.create({
  data: { name: "Motivasi", colorBg: "bg-primary" }
});

// Update data
await prisma.category.update({
  where: { id: 1 },
  data: { name: "Motivasi Baru" }
});

// Hapus data
await prisma.category.delete({
  where: { id: 1 }
});
```

> **Perbedaan penting:** Semua query Prisma bersifat **async/await** (harus pakai `await`) ✅

---

## 🌐 Bagian 3: API Routes (Seperti routes/api.php + Controller)

Di Laravel:
```php
// routes/api.php
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
```

Di Next.js, kamu cukup buat **satu file** `route.ts`:
```typescript
// src/app/api/categories/route.ts

// GET /api/categories
export async function GET(request: NextRequest) {
  const categories = await prisma.category.findMany();
  return NextResponse.json({ success: true, data: categories });
}

// POST /api/categories
export async function POST(request: NextRequest) {
  const body = await request.json();  // ← seperti $request->all() di Laravel
  const category = await prisma.category.create({ data: body });
  return NextResponse.json({ success: true, data: category }, { status: 201 });
}
```

> **Kuncinya:** nama fungsi = nama HTTP method. `GET`, `POST`, `PUT`, `DELETE` ✅

### URL Dinamis (seperti Route Parameter Laravel)

Di Laravel: `Route::get('/categories/{id}', ...)`

Di Next.js: buat folder `[id]` → file `[id]/route.ts`

```typescript
// src/app/api/categories/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;   // ← seperti $request->id di Laravel
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) }
  });
  return NextResponse.json({ success: true, data: category });
}
```

---

## 🧩 Bagian 4: Relasi Antar Model

Di Laravel (Eloquent):
```php
// Ambil quote beserta kategorinya
$quote = Quote::with('categories')->find(1);
```

Di Prisma:
```typescript
const quote = await prisma.quote.findUnique({
  where: { id: 1 },
  include: {              // ← seperti with('categories') di Laravel
    categories: {
      include: { category: true }
    }
  }
});
```

---

## 🔄 Bagian 5: Alur Kerja Sehari-hari

### Saat ingin tambah kolom baru di tabel:

**Laravel:**
```bash
php artisan make:migration add_slug_to_categories_table
# edit file migration
php artisan migrate
```

**Prisma:**
```prisma
// 1. Edit schema.prisma — tambah field baru
model Category {
  // ...field sebelumnya tetap ada
  slug String? @unique   // ← tambahkan ini
}
```
```bash
# 2. Jalankan migrate (Prisma yang generate SQL-nya otomatis)
npx prisma migrate dev --name add_slug_to_categories
```

---

## 🛠️ Bagian 6: Commands Penting

```bash
# Migration
npx prisma migrate dev --name nama     # Buat & jalankan migration baru
npx prisma migrate status              # Cek status migration
npx prisma migrate reset               # Reset DB (HATI-HATI: hapus semua data!)

# Client
npx prisma generate                    # Regenerate TypeScript types dari schema

# Inspect Database
npx prisma studio                      # Buka GUI di http://localhost:5555

# Validate
npx prisma validate                    # Cek apakah schema.prisma valid
```

---

## 💡 Tips: Perbedaan `.env` dan `.env.local`

| File | Dibaca oleh | Kapan |
|---|---|---|
| `.env` | Prisma CLI | Saat jalankan `npx prisma ...` di terminal |
| `.env.local` | Next.js (runtime) | Saat app berjalan — digunakan API routes |

> Di Laravel cukup `.env` untuk segalanya. Di Next.js ada dua karena Prisma CLI dan Next.js runtime berjalan terpisah.

---

## 🧪 Bagian 7: Test API Tanpa Frontend (Seperti Postman)

```bash
# GET semua kategori
curl http://localhost:3000/api/categories

# POST buat kategori baru
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Motivasi", "colorBg": "bg-primary", "glowColor": "rgba(192,193,255,0.6)"}'

# DELETE kategori ID 1
curl -X DELETE http://localhost:3000/api/categories/1
```

Atau pakai ekstensi VSCode **Thunder Client** (mirip Postman, gratis).

---

## 📌 Rangkuman Singkat

```
Laravel                          →  Next.js + Prisma
─────────────────────────────────────────────────────
migration file                   →  schema.prisma
php artisan migrate              →  npx prisma migrate dev
Eloquent (User::find())          →  prisma.user.findUnique()
routes/api.php + Controller      →  src/app/api/.../route.ts
$request->json()                 →  await request.json()
response()->json()               →  NextResponse.json()
with('relation')                 →  include: { relation: true }
.env                             →  .env (CLI) + .env.local (runtime)
```

---

> 💬 **Satu kalimat untuk diingat:**
> Di Prisma, kamu **deskripsikan** struktur database di `schema.prisma`,
> lalu Prisma yang **generate SQL-nya otomatis**.
> Di Laravel, kamu **tulis** SQL-nya sendiri di migration.
