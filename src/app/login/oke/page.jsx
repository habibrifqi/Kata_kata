"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [bubbleOffset, setBubbleOffset] = useState({ x: 0, y: 0 });

  // Floating bubxbles mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 100;
      const y = (e.clientY - window.innerHeight / 2) / 100;
      setBubbleOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const showNotification = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showNotification("Harap isi email dan password!", "error");
      return;
    }

    setIsLoading(true);
    // Frontend demo behavior
    setTimeout(() => {
      setIsLoading(false);
      showNotification(
        "Login berhasil! Mengalihkan ke dashboard...",
        "success",
      );
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 800);
  };

  const handleGoogleLogin = () => {
    showNotification("Login dengan Google (Demo Mode)", "success");
  };

  return (
    <div className="font-body-md text-body-md antialiased bg-background text-on-surface min-h-screen overflow-hidden">
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
                "Kreativitas adalah kecerdasan yang sedang bersenang-senang."
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
                "Fokuslah pada tempat yang ingin kamu tuju, bukan pada apa yang
                kamu takuti."
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
                "Mulailah dari mana kamu berada. Gunakan apa yang kamu miliki."
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
            {/* Mobile Logo (Visible only on small screens) */}
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

            {/* Form */}
            <form className="space-y-stack_md" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <label
                  className="font-label-md text-label-md text-on-surface ml-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="glass-surface rounded-xl flex items-center gap-3.5 px-4 transition-all duration-300 input-focus-ring">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
                    mail
                  </span>
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 py-4 px-1 text-on-surface placeholder:text-outline/50 font-body-md outline-none"
                    id="email"
                    placeholder="nama@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label
                    className="font-label-md text-label-md text-on-surface"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                    onClick={() =>
                      showNotification(
                        "Fitur Lupa Password dalam pengembangan",
                        "success",
                      )
                    }
                  >
                    Lupa Password?
                  </a>
                </div>
                <div className="glass-surface rounded-xl flex items-center gap-3.5 px-4 transition-all duration-300 input-focus-ring">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
                    lock
                  </span>
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 py-4 px-1 text-on-surface placeholder:text-outline/50 font-body-md outline-none"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 px-1">
                <input
                  className="w-4 h-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary focus:ring-offset-background transition-colors cursor-pointer"
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant cursor-pointer"
                  htmlFor="remember"
                >
                  Tetap masuk selama 30 hari
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4">
                <button
                  className="w-full primary-gradient-btn text-white font-label-md text-label-md py-4 rounded-xl flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-xl animate-spin">
                        progress_activity
                      </span>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-px w-full bg-outline-variant/30"></div>
              <span className="text-label-sm font-label-sm text-outline/50 whitespace-nowrap">
                atau lanjut dengan
              </span>
              <div className="h-px w-full bg-outline-variant/30"></div>
            </div>

            {/* Social Login (Google only) */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full glass-surface py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-surface-variant/50 transition-all font-label-md text-label-md cursor-pointer border border-outline-variant/20"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                <span>Google</span>
              </button>
            </div>

            {/* Footer Link */}
            <p className="text-center font-body-md text-body-md text-on-surface-variant">
              Belum punya akun?{" "}
              <Link
                href="#"
                className="text-primary font-bold hover:text-white transition-colors ml-1"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Background subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        </section>
      </main>
    </div>
  );
}
