# KataKata Dashboard - Project Architecture Documentation

Dokumentasi arsitektur dan struktur komponen untuk aplikasi **KataKata Curation Hub** (Next.js 16 App Router).

---

## 📁 Project Directory Structure

```text
dashboard_kata_kata/
├── public/                 # Asset statis (favicon, gambar, font lokal)
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── favicon.ico
│   │   ├── globals.css     # Design Tokens, Glassmorphism, Animation & Tailwind v4
│   │   ├── layout.jsx      # Root Layout (Fonts & Head metadata)
│   │   └── page.jsx        # Main Dashboard Page (Container Component)
│   │
│   └── components/         # Atomic & Domain-driven Component Architecture
│       ├── layout/         # Layout Wrapper Components
│       │   ├── Header.jsx       # Top navigation header dengan pencarian & user avatar
│       │   ├── Sidebar.jsx      # Desktop navigation sidebar dengan indikator aktif
│       │   └── MobileNav.jsx    # Bottom navigation bar khusus tampilan mobile
│       │
│       ├── dashboard/      # Business Domain Components untuk Dashboard
│       │   ├── StatCard.jsx          # Kartu statistik individual dengan efek mouse-glow & CountUp
│       │   ├── StatsGrid.jsx         # Grid layout container untuk statistik
│       │   ├── QuoteCard.jsx         # Kartu quote individual dengan aksi favorit & share
│       │   ├── RecentQuotes.jsx      # Section daftar quote terbaru
│       │   ├── PopularCategories.jsx # Section pill daftar kategori populer
│       │   └── AddQuoteFab.jsx       # Floating Action Button (FAB) tambah quote baru
│       │
│       └── ui/             # Generic / Reusable Design System UI Elements
│           └── CountUp.jsx           # Animasikan angka naik dari 0 saat di-scroll
│
├── package.json            # Project dependencies (Next 16, React 19, Lucide React, Tailwind v4)
├── next.config.mjs         # Konfigurasi Next.js
└── ARCHITECTURE.md         # Dokumentasi Struktur Project (File Ini)
```

---

## 🧩 Component Breakdown & Design System

### 1. `src/components/layout/`
- **`Sidebar.jsx`**: Menangani sistem navigasi desktop. Menggunakan warna `bg-surface/80` dengan efek `backdrop-blur-xl`.
- **`Header.jsx`**: Bar navigasi atas sticky dengan input pencarian interaktif, notifikasi, dan avatar pengguna.
- **`MobileNav.jsx`**: Navigasi khusus layar smartphone (layar `< lg`) yang ditempatkan di bagian bawah viewport.

### 2. `src/components/dashboard/`
- **`StatCard.jsx`**: Komponen stat individual berpola glassmorphism (`glass-surface` & `glass-card-hover`). Memiliki kalkulasi `--mouse-x` dan `--mouse-y` untuk memberikan efek visual glow saat kursor melintas.
- **`QuoteCard.jsx`**: Menampilkan teks quote, nama pembuat/kategori, tombol toggle *favorite*, dan tombol *share*.
- **`PopularCategories.jsx`**: Menampilkan kategori dengan aksen warna dan badge jumlah quote.
- **`AddQuoteFab.jsx`**: Tombol melayang (*Floating Action Button*) di pojok kanan bawah.

### 3. `src/components/ui/`
- **`CountUp.jsx`**: Menggunakan `IntersectionObserver` agar angka statistik dihitung naik secara konstan ketika card masuk ke dalam layar pengguna.

---

## 🎨 Design System & Styling Guidelines

- **Framework Styling**: Tailwind CSS v4 dengan custom `@theme` di `src/app/globals.css`.
- **Iconography**: `lucide-react` sebagai library vector SVG utama.
- **Theme Color Tokens**:
  - `Primary`: `#c0c1ff` (Purple Accent)
  - `Secondary`: `#d0bcff` (Light Violet)
  - `Tertiary`: `#ffb783` (Warm Orange)
  - `Background`: `#0a0e1a` / `#13131b` (Deep Dark Theme)
