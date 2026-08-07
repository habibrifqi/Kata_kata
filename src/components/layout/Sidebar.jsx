"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const DEFAULT_NAV_ITEMS = [
  { name: "Dashboard", icon: "dashboard", href: "/" },
  { name: "Quotes", icon: "format_quote", href: "/quotes" },
  { name: "Categories", icon: "category", href: "/categories" },
  { name: "Authors", icon: "person", href: "/authors" },
  { name: "Users", icon: "group", href: "/users" },
  // { name: "Scan Quote", icon: "document_scanner", href: "#scan" },
];

// ─── Role badge config ────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  superadmin: {
    label: "Super Admin",
    color: "text-tertiary bg-tertiary/10 border-tertiary/20",
  },
  admin: {
    label: "Admin",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  writer: {
    label: "Writer",
    color: "text-secondary bg-secondary/10 border-secondary/20",
  },
};

export default function Sidebar({
  activeMenu = "Dashboard",
  navItems = DEFAULT_NAV_ITEMS,
  user = null, // { name, email, image, role }
}) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login/oke");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const roleConfig = user?.role ? ROLE_CONFIG[user.role] : null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface/80 backdrop-blur-xl border-r border-outline-variant/20 shadow-xl shadow-primary/5 hidden lg:flex flex-col p-6 z-50">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-10">
        <Link href="/" className="inline-block">
          <Image
            src="/logo/logo_6.png"
            alt="KataKata Logo"
            width={180}
            height={50}
            className="h-auto max-h-12 w-auto object-contain brightness-130 contrast-105 filter drop-shadow-[0_0_12px_rgba(192,193,255,0.25)] transition-all hover:brightness-150"
            priority
          />
        </Link>
        {/* <span className="font-label-md text-label-md text-on-surface-variant opacity-70">
          Curation Hub
        </span> */}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = activeMenu === item.name;
          return (
            <Link
              key={item.name}
              href={item.href || "#"}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-secondary-container/30 text-primary border-l-4 border-primary shadow-[0_0_15px_rgba(192,193,255,0.3)]"
                  : "text-on-surface-variant hover:bg-surface-variant/50"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
                }
              >
                {item.icon}
              </span>
              <span className="font-body-md text-body-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="pt-6 border-t border-outline-variant/10 flex flex-col gap-2">
        {/* Add Quote Button */}
        <button className="bg-primary text-on-primary font-label-md text-label-md py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-4 active:scale-[0.98] transition-transform cursor-pointer">
          <span className="material-symbols-outlined">add</span>
          Add New Quote
        </button>

        {/* User Info (jika sudah login) */}
        {user && (
          <div className="glass-surface rounded-xl p-3 mb-2 flex items-center gap-3">
            {/* Avatar */}
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-outline-variant/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-base">
                  person
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-label-md text-label-md text-on-surface truncate text-sm leading-tight">
                {user.name}
              </p>
              {roleConfig && (
                <span
                  className={`inline-block text-xs px-1.5 py-0.5 rounded border font-label-sm mt-0.5 ${roleConfig.color}`}
                >
                  {roleConfig.label}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Settings */}
        <a
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all"
          href="#settings"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </a>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-container/20 transition-all w-full disabled:opacity-60 cursor-pointer"
        >
          {isLoggingOut ? (
            <span className="material-symbols-outlined animate-spin text-base">
              progress_activity
            </span>
          ) : (
            <span className="material-symbols-outlined">logout</span>
          )}
          <span className="font-body-md text-body-md">
            {isLoggingOut ? "Keluar..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}
