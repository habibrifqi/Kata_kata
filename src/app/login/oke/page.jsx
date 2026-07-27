"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ─── Error handler dari OAuth callback ───────────────────────────────────────
function ErrorNotifier({ showNotification }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;
    const errorMessages = {
      google_cancelled: "Login Google dibatalkan.",
      invalid_callback: "Callback tidak valid. Coba lagi.",
      invalid_state: "Sesi keamanan tidak valid. Coba lagi.",
      token_exchange_failed: "Gagal menghubungi Google. Coba lagi.",
      userinfo_failed: "Gagal mengambil data profil Google.",
      no_email: "Akun Google tidak memiliki email yang terverifikasi.",
      db_error: "Terjadi kesalahan server. Coba beberapa saat lagi.",
      session_failed: "Gagal membuat sesi. Coba lagi.",
      forbidden: "Anda tidak memiliki akses ke halaman tersebut.",
    };
    showNotification(errorMessages[error] || "Terjadi kesalahan.", "error");
  }, [searchParams, showNotification]);

  return null;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [bubbleOffset, setBubbleOffset] = useState({ x: 0, y: 0 });

  // Parallax floating bubbles on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 100;
      const y = (e.clientY - window.innerHeight / 2) / 100;
      setBubbleOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const showNotification = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="font-body-md text-body-md antialiased bg-background text-on-surface min-h-screen overflow-hidden">
      {/* Read error query param from OAuth callback */}
      <Suspense fallback={null}>
        <ErrorNotifier showNotification={showNotification} />
      </Suspense>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[120] px-5 py-3 rounded-2xl shadow-xl font-label-md text-label-md flex items-center gap-3 backdrop-blur-md transition-all ${
            toast.type === "error"
              ? "bg-error/90 text-on-error border border-error/30"
              : "bg-primary-container/90 text-on-primary-container border border-primary/30"
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="flex h-screen w-full">
        {/* Left Panel: Decorative Content */}
        <section className="hidden lg:flex relative w-1/2 indigo-gradient-bg overflow-hidden flex-col justify-center px-16">
          {/* Animated Background Floating Bubbles */}
          <div className="absolute inset-0 z-0">
            <div
              className="floating-bubble glass-surface rounded-2xl p-6 top-1/4 left-10 max-w-[280px] transition-transform duration-200 ease-out"
              style={{
                animationDelay: "0s",
                transform: `translate(${bubbleOffset.x * 0.2}px, ${bubbleOffset.y * 0.2}px)`,
              }}
            >
              <span className="material-symbols-outlined text-primary mb-2">
                format_quote
              </span>
              <p className="text-label-md font-label-md text-on-surface-variant italic">
                &ldquo;Kreativitas adalah kecerdasan yang sedang bersenang-senang.&rdquo;
              </p>
            </div>

            <div
              className="floating-bubble glass-surface rounded-2xl p-6 bottom-1/4 right-20 max-w-[320px] transition-transform duration-200 ease-out"
              style={{
                animationDelay: "2s",
                transform: `translate(${bubbleOffset.x * 0.4}px, ${bubbleOffset.y * 0.4}px)`,
              }}
            >
              <span className="material-symbols-outlined text-secondary mb-2">
                format_quote
              </span>
              <p className="text-label-md font-label-md text-on-surface-variant italic">
                &ldquo;Fokuslah pada tempat yang ingin kamu tuju, bukan pada apa yang
                kamu takuti.&rdquo;
              </p>
            </div>

            <div
              className="floating-bubble glass-surface rounded-2xl p-6 top-1/2 right-10 max-w-[240px] transition-transform duration-200 ease-out"
              style={{
                animationDelay: "4s",
                transform: `translate(${bubbleOffset.x * 0.6}px, ${bubbleOffset.y * 0.6}px)`,
              }}
            >
              <span className="material-symbols-outlined text-tertiary mb-2">
                format_quote
              </span>
              <p className="text-label-md font-label-md text-on-surface-variant italic">
                &ldquo;Mulailah dari mana kamu berada. Gunakan apa yang kamu miliki.&rdquo;
              </p>
            </div>
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span
                  className="material-symbols-outlined text-on-primary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
              </div>
              <span className="font-display-lg text-display-lg text-4xl font-extrabold text-primary tracking-tight">
                KataKata
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-4xl lg:text-[40px] font-extrabold leading-tight text-white max-w-lg">
              Simpan kata-kata yang{" "}
              <span className="text-primary">menginspirasimu</span>
            </h1>
            <p className="text-body-lg font-body-lg text-lg text-on-surface-variant/80 max-w-md">
              Wadah kurasi bagi para pemikir, penulis, dan kurator untuk
              mengelola aset intelektual dalam harmoni visual.
            </p>
          </div>

          {/* Footer Decorative */}
          <div className="absolute bottom-12 left-16 z-10 flex gap-4 text-label-sm font-label-sm text-xs text-on-surface-variant/40">
            <span>© 2024 KataKata Curation Hub</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </section>

        {/* Right Panel: Authentication Form */}
        <section className="w-full lg:w-1/2 bg-background flex items-center justify-center p-gutter relative overflow-y-auto">
          <div className="w-full max-w-md space-y-stack_lg py-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">
                  auto_awesome
                </span>
                <span className="font-headline-md text-headline-md text-2xl font-bold text-primary">
                  KataKata
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left">
              <h2 className="font-headline-md text-headline-md text-2xl font-bold text-white mb-2">
                Welcome back!
              </h2>
              <p className="font-body-md text-body-md text-base text-on-surface-variant">
                Masuk untuk melanjutkan kurasi inspirasi Anda.
              </p>
            </div>

            {/* Google Login — Metode utama */}
            <div>
              <button
                type="button"
                id="btn-google-login"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full glass-surface py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-surface-variant/50 transition-all font-label-md text-label-md cursor-pointer border border-outline-variant/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">
                      progress_activity
                    </span>
                    <span>Mengarahkan ke Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Lanjutkan dengan Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="h-px w-full bg-outline-variant/30"></div>
              <span className="text-label-sm font-label-sm text-outline/50 whitespace-nowrap">
                metode lain
              </span>
              <div className="h-px w-full bg-outline-variant/30"></div>
            </div>

            {/* Email / Password — Coming Soon */}
            <div className="glass-surface rounded-xl px-5 py-4 border border-outline-variant/10 opacity-50 select-none">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  lock_clock
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Login Email &amp; Password
                </span>
                <span className="ml-auto text-xs bg-surface-variant/60 text-outline px-2 py-0.5 rounded-full font-label-sm">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-on-surface-variant/60 font-body-sm">
                Fitur ini sedang dalam pengembangan. Gunakan Google untuk saat ini.
              </p>
            </div>

            {/* Footer */}
            <p className="text-center font-body-md text-body-md text-on-surface-variant text-sm">
              Dengan login, Anda menyetujui{" "}
              <a href="#" className="text-primary hover:underline">
                Syarat Layanan
              </a>{" "}
              &amp;{" "}
              <a href="#" className="text-primary hover:underline">
                Kebijakan Privasi
              </a>{" "}
              KataKata.
            </p>
          </div>

          {/* Background subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        </section>
      </main>
    </div>
  );
}
