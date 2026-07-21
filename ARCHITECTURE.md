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
│   │   ├── page.jsx        # Main Dashboard Page (Route: /)
│   │   └── quotes/         # Halaman Koleksi Quotes
│   │       └── page.jsx    # Quotes Collection Page (Route: /quotes)
│   │
│   └── components/         # Atomic & Domain-driven Component Architecture
│       ├── layout/         # Layout Wrapper Components
│       │   ├── Header.jsx       # Top navigation header dengan pencarian real-time & user avatar
│       │   ├── Sidebar.jsx      # Desktop navigation sidebar dengan routing Link
│       │   └── MobileNav.jsx    # Bottom navigation bar khusus tampilan mobile
│       │
│       ├── dashboard/      # Business Domain Components untuk Dashboard Utama
│       │   ├── StatCard.jsx          # Kartu statistik individual dengan efek mouse-glow & CountUp
│       │   ├── StatsGrid.jsx         # Grid layout container untuk statistik
│       │   ├── QuoteCard.jsx         # Kartu quote ringkas untuk dashboard
│       │   ├── RecentQuotes.jsx      # Section daftar quote terbaru
│       │   ├── PopularCategories.jsx # Section pill daftar kategori populer
│       │   └── AddQuoteFab.jsx       # Floating Action Button (FAB) tambah quote baru
│       │
│       ├── quotes/         # Business Domain Components untuk Halaman /quotes
│       │   ├── CategoryFilters.jsx   # Filter pill horizontal kategori
│       │   ├── QuoteCard.jsx         # Kartu quote lengkap (Mode Grid & List view, Favorite, Edit, Delete)
│       │   ├── EmptyState.jsx        # Placeholder saat pencarian 0 hasil
│       │   └── Pagination.jsx        # Bar navigasi halaman paginasi
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

### 1. Route `/` (Dashboard)
- **`Sidebar.jsx`**: Sistem navigasi utama desktop dengan dukungan `Link` Next.js (`activeMenu="Dashboard"`).
- **`Header.jsx`**: Bar navigasi atas sticky dengan input pencarian.
- **`StatsGrid.jsx` & `StatCard.jsx`**: Menampilkan statistik utama dengan efek *CountUp animation*.
- **`RecentQuotes.jsx` & `PopularCategories.jsx`**: Menampilkan kurasi quote terbaru dan kategori populer.

### 2. Route `/quotes` (Quotes Collection)
- **`CategoryFilters.jsx`**: Menampilkan filter kategori (Semua, Motivasi, Islami, Cinta, Bisnis, Teknologi, Filosofi).
- **`QuoteCard.jsx`**: Mendukung tampilan **Grid View** dan **List View** dengan aksi interaktif (Favorite, Edit, Delete).
- **`EmptyState.jsx`**: Ditampilkan saat hasil pencarian atau filter kategori tidak menghasilkan quote apapun.
- **`Pagination.jsx`**: Navigasi perpindahan halaman (*previous, 1..12, next*).

---

## 🎨 Design System & Styling Guidelines

- **Framework Styling**: Tailwind CSS v4 dengan custom `@theme` di `src/app/globals.css`.
- **Iconography**: `lucide-react` sebagai library vector SVG utama.
- **Theme Color Tokens**:
  - `Primary`: `#c0c1ff` (Purple Accent)
  - `Secondary`: `#d0bcff` (Light Violet)
  - `Tertiary`: `#ffb783` (Warm Orange)
  - `Background`: `#0a0e1a` / `#13131b` (Deep Dark Theme)
