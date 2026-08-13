import Link from "next/link";

export const metadata = {
  title: "404 – Halaman Tidak Ditemukan | KataKata",
  description: "Halaman yang kamu cari tidak ditemukan.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Glow Orb */}
      <div
        aria-hidden="true"
        className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none"
      />

      {/* 404 number */}
      <p className="text-[clamp(6rem,20vw,10rem)] font-extrabold leading-none bg-gradient-to-br from-primary via-primary-container to-secondary-container bg-clip-text text-transparent tracking-tighter select-none m-0">
        404
      </p>

      {/* Headline */}
      <h1 className="text-[clamp(1.4rem,4vw,2rem)] font-bold text-on-surface mt-4 mb-2">
        Halaman Tidak Ditemukan
      </h1>

      {/* Sub-text */}
      <p className="text-on-surface-variant text-base max-w-md leading-relaxed mb-8">
        Halaman yang Anda tuju tidak ditemukan atau membutuhkan hak akses (login) terlebih dahulu.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 z-10">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface hover:border-primary hover:text-primary transition-all font-label-md"
        >
          Kembali ke Explore
        </Link>
        <Link
          href="/login/oke"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-white font-label-md shadow-lg shadow-primary-container/20 hover:opacity-90 transition-opacity"
        >
          Masuk ke Akun
        </Link>
      </div>
    </div>
  );
}
