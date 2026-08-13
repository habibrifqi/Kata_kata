import Link from "next/link";

export const metadata = {
  title: "404 – Halaman Tidak Ditemukan | QuotesBox",
  description: "Halaman yang kamu cari tidak ditemukan.",
};

export default function DashboardNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0e1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-plus-jakarta-sans, sans-serif)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Glow orb */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(192,193,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* 404 number */}
      <p
        style={{
          fontSize: "clamp(6rem, 20vw, 10rem)",
          fontWeight: 800,
          lineHeight: 1,
          background: "linear-gradient(135deg, #c0c1ff 0%, #9b8aff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          margin: 0,
          letterSpacing: "-0.04em",
          userSelect: "none",
        }}
      >
        404
      </p>

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(1.4rem, 4vw, 2rem)",
          fontWeight: 700,
          color: "#e4e1ed",
          marginTop: "1rem",
          marginBottom: "0.5rem",
        }}
      >
        Halaman tidak ditemukan
      </h1>

      {/* Sub-text */}
      <p
        style={{
          color: "#7b7a91",
          fontSize: "1rem",
          maxWidth: "380px",
          lineHeight: 1.6,
          marginBottom: "2.5rem",
        }}
      >
        Kamu perlu masuk terlebih dahulu untuk mengakses area ini, atau halaman
        yang kamu tuju memang tidak ada.
      </p>

      {/* CTA */}
      <Link
        href="/login"
        style={{
          display: "inline-block",
          padding: "0.75rem 2rem",
          borderRadius: "0.75rem",
          background: "linear-gradient(135deg, #c0c1ff 0%, #9b8aff 100%)",
          color: "#0a0e1a",
          fontWeight: 700,
          fontSize: "0.95rem",
          textDecoration: "none",
          boxShadow: "0 0 24px rgba(192,193,255,0.35)",
          transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Masuk ke Akun
      </Link>
    </div>
  );
}
