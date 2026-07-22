# 📚 Dokumentasi Fitur Kategori (Categories)

Dokumen ini menjelaskan secara **detail dan lengkap** cara kerja fitur Kategori pada aplikasi dashboard KataKata.
Cocok untuk pemula yang masih belajar Next.js!

---

## 🗂️ Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Struktur File & Folder](#2-struktur-file--folder)
3. [Database Schema (Prisma)](#3-database-schema-prisma)
4. [API Routes (Backend)](#4-api-routes-backend)
5. [Halaman Utama (Page)](#5-halaman-utama-page)
6. [Komponen-komponen (Components)](#6-komponen-komponen-components)
7. [Alur Kerja CRUD](#7-alur-kerja-crud)
8. [Keamanan](#8-keamanan)
9. [Glosarium untuk Pemula Next.js](#9-glosarium-untuk-pemula-nextjs)

---

## 1. Gambaran Umum

Fitur **Kategori** memungkinkan pengguna untuk:

| Operasi             | Deskripsi                                                   |
| ------------------- | ----------------------------------------------------------- |
| ✅ **Create**       | Tambah kategori baru via Modal atau Form Inline             |
| ✅ **Read**         | Tampilkan daftar kategori dari database secara real-time    |
| ✅ **Update**       | Edit nama & warna kategori via Modal Edit                   |
| ✅ **Delete**       | Hapus kategori dengan konfirmasi modal (tidak bisa di-undo) |
| 🔍 **Search**       | Cari kategori berdasarkan nama (filter lokal, responsif)    |
| 📄 **Pagination**   | Navigasi halaman (4 item per halaman)                       |
| 🎨 **Color Picker** | Pilih warna preset atau warna kustom HEX bebas              |

---

## 2. Struktur File & Folder

```
src/
│
├── app/
│   ├── categories/
│   │   └── page.jsx                  ← Halaman utama kategori (UI + Logic)
│   │
│   └── api/
│       └── categories/
│           ├── route.ts              ← API: GET semua & POST kategori baru
│           └── [id]/
│               └── route.ts         ← API: GET, PUT, DELETE berdasarkan ID
│
├── components/
│   ├── categories/
│   │   ├── CategoryStats.jsx         ← Kartu statistik (total, kutipan, top)
│   │   ├── CategorySearch.jsx        ← Input pencarian kategori
│   │   ├── CategoryList.jsx          ← Tabel daftar kategori
│   │   ├── CategoryPagination.jsx    ← Navigasi halaman
│   │   ├── CategoryForm.jsx          ← Form tambah kategori inline
│   │   └── CategoryModal.jsx         ← Modal tambah/edit kategori
│   │
│   └── common/
│       └── ConfirmModal.jsx          ← Modal konfirmasi hapus (reusable)
│
└── prisma/
    └── schema.prisma                 ← Definisi tabel database
```

> 💡 **Catatan Next.js**: Folder `app/` menggunakan sistem **App Router** (Next.js 13+). Setiap folder yang berisi `page.jsx` otomatis menjadi sebuah halaman URL. Contoh: `app/categories/page.jsx` → bisa diakses di `/categories`.

---

## 3. Database Schema (Prisma)

File: `prisma/schema.prisma`

```prisma
model Category {
  id          Int             @id @default(autoincrement())
  name        String          @unique         // Nama kategori, wajib unik
  colorBg     String          @default("bg-primary")   // Kelas warna Tailwind atau kode HEX (#RRGGBB)
  glowColor   String          @default("rgba(192, 193, 255, 0.6)") // Warna efek glow (format RGBA)
  quotesCount Int             @default(0)     // Jumlah kutipan dalam kategori ini
  createdAt   DateTime        @default(now()) // Tanggal dibuat (otomatis diisi)
  updatedAt   DateTime        @updatedAt      // Tanggal update terakhir (otomatis diperbarui)
  quotes      QuoteCategory[]                 // Relasi ke tabel kutipan (many-to-many)

  @@map("categories") // Nama tabel di PostgreSQL adalah "categories"
}
```

### Penjelasan Setiap Field:

| Field         | Tipe     | Keterangan                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `id`          | Int      | Primary key, otomatis bertambah (1, 2, 3, ...)                     |
| `name`        | String   | Nama kategori, **harus unik** di database                          |
| `colorBg`     | String   | Warna latar label (kelas Tailwind atau kode HEX seperti `#a855f7`) |
| `glowColor`   | String   | Warna efek cahaya (glow) dalam format `rgba(r, g, b, alpha)`       |
| `quotesCount` | Int      | Jumlah kutipan, default 0                                          |
| `createdAt`   | DateTime | Waktu kategori dibuat                                              |
| `updatedAt`   | DateTime | Waktu kategori terakhir diubah                                     |

> 💡 **Apa itu Prisma?** Prisma adalah **ORM (Object-Relational Mapper)** - sebuah alat yang memungkinkan kita berinteraksi dengan database PostgreSQL menggunakan kode JavaScript/TypeScript, tanpa harus menulis perintah SQL mentah. Ini juga melindungi kita dari SQL Injection secara otomatis.

---

## 4. API Routes (Backend)

Di Next.js App Router, file `route.ts` di dalam folder `api/` berfungsi sebagai **endpoint REST API**.

> 💡 **Apa itu API Route?** Di Next.js, kamu bisa membuat backend API langsung di dalam project yang sama, tanpa perlu server Express.js terpisah. File `route.ts` adalah tempatnya.

---

### 4.1. `GET /api/categories` — Ambil Semua Kategori

File: `src/app/api/categories/route.ts`

```ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";

  const categories = await prisma.category.findMany({
    where: search
      ? {
          name: { contains: search, mode: "insensitive" },
        }
      : undefined,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ success: true, data: categories });
}
```

**Cara kerjanya:**

1. Menerima request `GET /api/categories` (atau `GET /api/categories?search=motivasi`)
2. Jika ada parameter `search`, filter kategori berdasarkan nama (tidak peduli huruf besar/kecil)
3. Urutkan dari yang paling baru di-update
4. Kembalikan data dalam format JSON

---

### 4.2. `POST /api/categories` — Buat Kategori Baru

File: `src/app/api/categories/route.ts`

```ts
export async function POST(request: NextRequest) {
  const body = await request.json(); // Baca data yang dikirim dari frontend

  if (!body.name?.trim()) {
    return NextResponse.json(
      { success: false, error: "Nama kategori tidak boleh kosong" },
      { status: 400 },
    );
  }

  const category = await prisma.category.create({
    data: {
      name: body.name.trim(),
      colorBg: body.colorBg ?? "bg-primary",
      glowColor: body.glowColor ?? "rgba(192, 193, 255, 0.6)",
    },
  });

  return NextResponse.json({ success: true, data: category }, { status: 201 });
}
```

**Cara kerjanya:**

1. Frontend mengirim data JSON via `fetch("/api/categories", { method: "POST", body: JSON.stringify({...}) })`
2. Backend membaca data tersebut dengan `request.json()`
3. Validasi: nama tidak boleh kosong
4. Simpan ke database via Prisma
5. Kembalikan data kategori yang baru dibuat (status 201 = Created)

---

### 4.3. `PUT /api/categories/[id]` — Update Kategori

File: `src/app/api/categories/[id]/route.ts`

> 💡 **Apa itu `[id]`?** Ini adalah **Dynamic Route** di Next.js. Tanda kurung siku `[id]` berarti nilai ID-nya bisa berubah-ubah. Jadi `/api/categories/1`, `/api/categories/5`, dll semuanya ditangani oleh file route yang sama.

```ts
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const categoryId = parseInt(id, 10); // Ubah string "5" menjadi angka 5

  const body = await request.json();

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(body.name && { name: body.name.trim() }),
      ...(body.colorBg && { colorBg: body.colorBg }),
      ...(body.glowColor && { glowColor: body.glowColor }),
    },
  });

  return NextResponse.json({ success: true, data: category });
}
```

**Cara kerjanya:**

1. Menerima `PUT /api/categories/5` (misalnya)
2. Ambil ID dari URL params
3. Update hanya field yang dikirimkan (jika `name` tidak dikirim, `name` di database tidak berubah)
4. Kembalikan data yang sudah diperbarui

---

### 4.4. `DELETE /api/categories/[id]` — Hapus Kategori

File: `src/app/api/categories/[id]/route.ts`

```ts
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);

  await prisma.category.delete({
    where: { id: categoryId },
  });

  return NextResponse.json({
    success: true,
    message: "Kategori berhasil dihapus",
  });
}
```

**Cara kerjanya:**

1. Menerima `DELETE /api/categories/5`
2. Hapus data dari database berdasarkan ID
3. Kembalikan pesan sukses

---

## 5. Halaman Utama (Page)

File: `src/app/categories/page.jsx`

Ini adalah "otak" dari fitur kategori. Semua **state** (data yang bisa berubah) dan **logic** dikelola di sini.

> 💡 **Apa itu `"use client"`?** Baris `"use client"` di bagian atas file berarti komponen ini berjalan di **browser pengguna** (client-side), bukan di server. Ini diperlukan karena kita menggunakan React hooks seperti `useState`, `useEffect`, dll.

### 5.1. State yang Dikelola

```jsx
const [categories, setCategories] = useState([]); // Data semua kategori dari database
const [isLoading, setIsLoading] = useState(true); // Apakah sedang memuat data?
const [error, setError] = useState(null); // Pesan error jika gagal
const [toast, setToast] = useState(null); // Notifikasi popup (sukses/gagal)
const [searchQuery, setSearchQuery] = useState(""); // Teks pencarian
const [currentPage, setCurrentPage] = useState(1); // Halaman pagination saat ini

// Modal tambah/edit
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingCategory, setEditingCategory] = useState(null); // null = tambah baru, ada isi = edit

// Modal konfirmasi hapus
const [deletingCategory, setDeletingCategory] = useState(null);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false); // Apakah sedang proses hapus?
```

> 💡 **Apa itu `useState`?** Hook React untuk menyimpan data yang bisa berubah. Ketika nilai berubah lewat `setState(...)`, React otomatis me-render ulang tampilan. Contoh: `setIsLoading(false)` akan membuat spinner hilang dan menampilkan daftar kategori.

---

### 5.2. Fetch Data Saat Halaman Dibuka

```jsx
const fetchCategories = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const res = await fetch("/api/categories"); // Kirim request ke API
    const result = await res.json(); // Parse respons JSON
    setCategories(result.data || []); // Simpan data ke state
  } catch (err) {
    setError(err.message || "Gagal memuat kategori");
  } finally {
    setIsLoading(false); // Matikan loading spinner
  }
}, []);

useEffect(() => {
  fetchCategories(); // Panggil saat komponen pertama kali muncul
}, [fetchCategories]);
```

> 💡 **Apa itu `useEffect`?** Hook untuk menjalankan kode setelah komponen tampil di layar. Di sini dipakai untuk memanggil `fetchCategories()` saat halaman pertama kali dibuka.
>
> 💡 **Apa itu `useCallback`?** Dipakai untuk membungkus fungsi agar tidak dibuat ulang setiap kali render. Ini penting karena `fetchCategories` dipakai di dalam `useEffect`.

---

### 5.3. Logic Pagination dan Filter

```jsx
const ITEMS_PER_PAGE = 4; // Tampilkan 4 kategori per halaman

// Filter berdasarkan kata kunci pencarian
const filteredCategories = categories.filter((cat) =>
  cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
);

// Hitung total halaman
const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE) || 1;

// Ambil hanya kategori untuk halaman saat ini
const paginatedCategories = filteredCategories.slice(
  (currentPage - 1) * ITEMS_PER_PAGE, // Index mulai
  currentPage * ITEMS_PER_PAGE, // Index akhir
);
```

> 💡 Pencarian dilakukan di **sisi client (browser)** bukan ke server, jadi responsnya sangat cepat tanpa perlu request API baru.

---

## 6. Komponen-komponen (Components)

### 6.1. `CategoryStats.jsx` — Kartu Statistik

Menampilkan 3 kartu informasi di bagian atas halaman.

```jsx
<CategoryStats
  totalCategories={12} // Total jumlah kategori
  totalQuotes={342} // Total kutipan di semua kategori
  topCategory="Motivasi" // Nama kategori dengan kutipan terbanyak
/>
```

Data ini dihitung secara otomatis di `page.jsx`:

```jsx
const totalQuotes = categories.reduce(
  (sum, c) => sum + (c.quotesCount || 0),
  0,
);
const topCategoryItem = [...categories].sort(
  (a, b) => b.quotesCount - a.quotesCount,
)[0];
```

---

### 6.2. `CategorySearch.jsx` — Input Pencarian

Komponen input sederhana yang menerima 2 props:

- `value`: nilai teks pencarian saat ini
- `onChange`: fungsi yang dipanggil saat pengguna mengetik

```jsx
<CategorySearch value={searchQuery} onChange={setSearchQuery} />
```

---

### 6.3. `CategoryList.jsx` — Tabel Daftar Kategori

Menampilkan data kategori dalam bentuk tabel dengan kolom:

- **Topik & Warna** — Dot lingkaran warna + nama kategori
- **Jumlah Kutipan** — Badge hitungan quotes
- **Terakhir Diperbarui** — Tanggal dalam format Indonesia (misal: "22 Jul 2026")
- **Aksi** — Tombol Edit (biru) dan Hapus (merah)

```jsx
<CategoryList
  categories={paginatedCategories} // Data yang sudah difilter & dipaginasi
  onEdit={handleOpenEditModal} // Dipanggil saat tombol Edit diklik
  onDelete={handleOpenDeleteModal} // Dipanggil saat tombol Hapus diklik
/>
```

**Cara komponen menampilkan warna:**

```jsx
// Mendukung 2 format warna:
// 1. Kelas Tailwind: "bg-primary", "bg-emerald-400", dll
// 2. Kode HEX kustom: "#a855f7", "#10b981", dll

const isHex = cat.colorBg && cat.colorBg.startsWith("#");

<div
  className={`w-3 h-3 rounded-full ${!isHex ? cat.colorBg : ""}`}
  style={{
    backgroundColor: isHex ? cat.colorBg : undefined, // Warna kustom HEX
    boxShadow: `0 0 8px ${cat.glowColor}`, // Efek glow
  }}
/>;
```

---

### 6.4. `CategoryPagination.jsx` — Navigasi Halaman

Menampilkan tombol navigasi halaman. Otomatis hilang (`return null`) jika data ≤ 4 item.

```jsx
<CategoryPagination
  currentPage={2} // Halaman yang sedang aktif
  totalPages={5} // Total halaman
  onPageChange={setCurrentPage} // Dipanggil saat ganti halaman
/>
```

---

### 6.5. `CategoryForm.jsx` — Form Tambah Kategori Inline

Form di bagian **bawah halaman** untuk tambah kategori baru tanpa modal.

Mengelola 3 state lokal:

- `name` — Nama kategori yang diketik
- `selectedColor` — Warna preset yang dipilih (objek dari `PRESET_COLORS`)
- `customHex` — Nilai HEX warna kustom (dari color picker)

**Daftar Warna Preset:**

```js
export const PRESET_COLORS = [
  { id: "primary", bgClass: "bg-primary", glow: "rgba(192, 193, 255, 0.4)" },
  {
    id: "secondary",
    bgClass: "bg-secondary",
    glow: "rgba(208, 188, 255, 0.4)",
  },
  // ... dst
];
```

**Custom Color Picker:**

```jsx
// Tombol yang berisi input type="color" tersembunyi
<div className="relative w-8 h-8 rounded-full ...">
  <input
    type="color" // Native browser color picker
    value={customHex} // Nilai HEX saat ini
    onChange={(e) => handleCustomColorChange(e.target.value)}
    className="absolute inset-0 opacity-0 cursor-pointer" // Disembunyikan, tapi bisa diklik
  />
  <span>palette</span> // Icon yang terlihat
</div>
```

**Fungsi konversi HEX → RGBA** (untuk efek glow):

```js
export function hexToRgba(hex, alpha = 0.4) {
  // Contoh: "#a855f7" → "rgba(168, 85, 247, 0.4)"
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```

---

### 6.6. `CategoryModal.jsx` — Modal Tambah/Edit

Modal yang muncul di tengah layar saat:

- Klik tombol **"Tambah Kategori"** (mode: tambah baru)
- Klik tombol **Edit** di tabel (mode: edit kategori yang ada)

**Cara modal tahu harus mode tambah atau edit:**

```jsx
// Di page.jsx:
const handleOpenAddModal = () => {
  setEditingCategory(null);       // null = mode tambah baru
  setIsModalOpen(true);
};

const handleOpenEditModal = (cat) => {
  setEditingCategory(cat);        // Ada isi = mode edit
  setIsModalOpen(true);
};

// Di CategoryModal.jsx:
<h2>{category ? "Edit Kategori" : "Tambah Kategori"}</h2>
<button type="submit">{category ? "Perbarui" : "Simpan"}</button>
```

**Mengisi ulang form saat edit:**

```jsx
useEffect(() => {
  if (category) {
    setName(category.name || "");           // Isi nama dari data yang ada

    if (category.colorBg.startsWith("#")) {
      // Warna kustom HEX
      setCustomHex(category.colorBg);
      setSelectedColor({ id: "custom", bgClass: category.colorBg, ... });
    } else {
      // Warna preset Tailwind
      const matched = PRESET_COLORS.find(c => c.bgClass === category.colorBg);
      setSelectedColor(matched || PRESET_COLORS[0]);
    }
  } else {
    // Reset form untuk mode tambah baru
    setName("");
    setSelectedColor(PRESET_COLORS[0]);
  }
}, [category, isOpen]); // Jalankan ulang setiap kali category atau isOpen berubah
```

---

### 6.7. `ConfirmModal.jsx` — Modal Konfirmasi Hapus

Komponen **reusable** (bisa dipakai ulang di mana saja) untuk dialog konfirmasi hapus data.

```jsx
<ConfirmModal
  isOpen={isDeleteModalOpen} // Apakah modal tampil?
  onClose={() => setIsDeleteModalOpen(false)} // Saat klik "Batal"
  onConfirm={handleConfirmDelete} // Saat klik "Hapus Permanen"
  title="Hapus Kategori?"
  message={`Apakah Anda yakin menghapus "${deletingCategory?.name}"?`}
  confirmLabel="Hapus Permanen"
  cancelLabel="Batal"
  isLoading={isDeleting} // Tampilkan spinner saat proses hapus
/>
```

---

## 7. Alur Kerja CRUD

### ✅ CREATE — Tambah Kategori Baru

```
Pengguna klik "Tambah Kategori"
    ↓
Modal terbuka (isModalOpen = true, editingCategory = null)
    ↓
Pengguna isi nama + pilih warna → klik "Simpan"
    ↓
handleSaveCategory({ name, colorBg, glowColor }) dipanggil
    ↓
POST /api/categories  ← fetch() ke backend
    ↓
Prisma menyimpan ke database PostgreSQL
    ↓
fetchCategories() dipanggil → daftar diperbarui
    ↓
Toast sukses muncul: "Kategori baru berhasil ditambahkan!"
```

### ✏️ UPDATE — Edit Kategori

```
Pengguna klik tombol Edit (ikon pensil) di tabel
    ↓
handleOpenEditModal(cat) dipanggil
    ↓
editingCategory diisi dengan data kategori yang dipilih
    ↓
Modal terbuka, form terisi otomatis dengan data lama
    ↓
Pengguna ubah nama/warna → klik "Perbarui"
    ↓
handleSaveCategory({ id, name, colorBg, glowColor }) dipanggil
    ↓
PUT /api/categories/[id]  ← fetch() ke backend
    ↓
Prisma mengupdate data di database
    ↓
fetchCategories() → daftar diperbarui
    ↓
Toast sukses: "Kategori berhasil diupdate!"
```

### 🗑️ DELETE — Hapus Kategori

```
Pengguna klik tombol Hapus (ikon tong sampah) di tabel
    ↓
handleOpenDeleteModal(id) dipanggil
    ↓
ConfirmModal muncul dengan nama kategori
    ↓
Pengguna klik "Hapus Permanen"
    ↓
handleConfirmDelete() dipanggil (isDeleting = true → spinner muncul)
    ↓
DELETE /api/categories/[id]  ← fetch() ke backend
    ↓
Prisma menghapus data dari database
    ↓
Modal ditutup, fetchCategories() → daftar diperbarui
    ↓
Toast sukses: "Kategori 'X' berhasil dihapus"
```

---

## 8. Keamanan

| Ancaman                        | Status             | Penjelasan                                                                                                |
| ------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------- |
| **SQL Injection**              | ✅ Aman            | Prisma menggunakan Parameterized Queries secara otomatis                                                  |
| **XSS (Cross-Site Scripting)** | ✅ Aman            | React/JSX otomatis meng-escape semua teks sebelum ditampilkan                                             |
| **Duplicate Entry**            | ✅ Handled         | Prisma mengembalikan error `P2002` jika nama duplikat, direspons dengan HTTP 409 + pesan error yang jelas |
| **Invalid ID**                 | ✅ Handled         | API memeriksa `isNaN(id)` dan mengembalikan HTTP 400 jika ID tidak valid                                  |
| **Panjang Input**              | ⚠️ Belum ada batas | Belum ada validasi Zod untuk batas maksimal karakter (bisa ditambahkan di masa depan)                     |

---

## 9. Glosarium untuk Pemula Next.js

| Istilah              | Penjelasan                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **App Router**       | Sistem routing Next.js 13+. Setiap file `page.jsx` dalam folder `app/` menjadi halaman URL otomatis       |
| **API Route**        | File `route.ts` di dalam folder `api/` yang berfungsi sebagai endpoint backend REST API                   |
| **Dynamic Route**    | Folder `[id]` — nilai dalam kurung siku bisa diisi apa saja (ID angka, slug teks, dll)                    |
| **Server Component** | Komponen yang dirender di server (default di Next.js App Router), tidak bisa pakai `useState`/`useEffect` |
| **Client Component** | Komponen yang dirender di browser. Wajib tambahkan `"use client"` di baris pertama                        |
| **`useState`**       | Hook untuk menyimpan data yang bisa berubah. Ketika berubah, UI otomatis diperbarui                       |
| **`useEffect`**      | Hook untuk menjalankan kode setelah komponen tampil/berubah (misal: fetch data saat halaman dibuka)       |
| **`useCallback`**    | Hook untuk mencegah fungsi dibuat ulang setiap render (optimasi performa)                                 |
| **Props**            | Data yang dikirim dari komponen induk ke komponen anak, seperti argumen fungsi                            |
| **Prisma**           | ORM untuk berinteraksi dengan database tanpa menulis SQL secara langsung                                  |
| **ORM**              | Object-Relational Mapper — jembatan antara kode JavaScript dan database relasional                        |
| **`fetch()`**        | API browser/Node.js untuk membuat HTTP request (mengambil atau mengirim data ke API)                      |
| **`async/await`**    | Cara menulis kode asynchronous yang lebih mudah dibaca daripada `.then()`                                 |
| **REST API**         | Arsitektur API menggunakan method HTTP: GET (baca), POST (buat), PUT (ubah), DELETE (hapus)               |
| **JSON**             | Format data teks yang digunakan untuk bertukar data antara frontend dan backend                           |
| **State**            | Data yang dikelola React dan dapat berubah. Perubahan state → UI dirender ulang                           |

---

> **Dibuat untuk proyek dashboard KataKata**
> Terakhir diperbarui: 22 Juli 2026
