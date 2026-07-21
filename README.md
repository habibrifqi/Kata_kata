# KataKata - Curation Hub Dashboard

Modern & Premium Content Curation Hub untuk kutipan (*quotes*) dan aset intelektual. Dibuat dengan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan **Lucide React Icons**.

---

## ✨ Fitur Utama

- 🎨 **Modern Glassmorphic UI**: Antarmuka bertema gelap (*dark mode*) dengan efek glassmorphism & animasi hover interaktif.
- ⚡ **Desain Komponen Modular**: Struktur komponen terpisah secara jelas (`layout`, `dashboard`, dan `ui`).
- 📊 **Statistik Interaktif**: Fitur kalkulasi angka naik (*Count-up animation*) ketika card tampil pada viewport.
- 📱 **Fully Responsive Layout**: Dukungan penuh untuk perangkat Desktop (Sidebar) dan Mobile (Bottom Navigation).
- 🏷️ **Kategori & Favorit**: Pengelompokan quote berdasarkan kategori dan fitur toggle favorit.

---

## 🛠️ Teknologi & Dependencies

- **Framework**: Next.js 16.2.10 (App Router Turbopack)
- **Library UI**: React 19.2.4
- **Styling**: Tailwind CSS v4 & PostCSS
- **Icon Set**: Lucide React
- **Typography**: Google Fonts (*Plus Jakarta Sans*)

---

## 📂 Struktur Project

Dokumentasi lengkap mengenai arsitektur project dapat dilihat di [ARCHITECTURE.md](file:///Users/bidang3-m4-d96gcq2rk2-2025/code/js/dashboard_kata_kata/ARCHITECTURE.md).

```text
src/
├── app/                  # Route & Page Layouts
│   ├── globals.css       # Design System & Tailwind CSS Tokens
│   ├── layout.jsx        # Root Layout
│   └── page.jsx          # Dashboard Page
└── components/           # Component Architecture
    ├── layout/           # Header, Sidebar, MobileNav
    ├── dashboard/        # StatCard, RecentQuotes, QuoteCard, PopularCategories, AddQuoteFab
    └── ui/               # CountUp helper
```

---

## 🚀 Cara Menjalankan Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Mode Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### 3. Build untuk Production
```bash
npm run build
npm run start
```
