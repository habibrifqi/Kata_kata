"use client";

import Link from "next/link";

export const DEFAULT_NAV_ITEMS = [
  { name: "Dashboard", icon: "dashboard", href: "/" },
  { name: "Quotes", icon: "format_quote", href: "/quotes" },
  { name: "Categories", icon: "category", href: "/categories" },
  { name: "Authors", icon: "person", href: "/authors" },
  { name: "Scan Quote", icon: "document_scanner", href: "#scan" }
];

export default function Sidebar({ activeMenu = "Categories", navItems = DEFAULT_NAV_ITEMS }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface/80 backdrop-blur-xl border-r border-outline-variant/20 shadow-xl shadow-primary/5 hidden lg:flex flex-col p-6 z-50">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-10">
        <Link href="/">
          <h1 className="font-display-lg text-display-lg font-extrabold text-primary tracking-tight">
            KataKata
          </h1>
        </Link>
        <span className="font-label-md text-label-md text-on-surface-variant opacity-70">
          Curation Hub
        </span>
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
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md text-body-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-outline-variant/10 flex flex-col gap-2">
        <button className="bg-primary text-on-primary font-label-md text-label-md py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-4 active:scale-[0.98] transition-transform cursor-pointer">
          <span className="material-symbols-outlined">add</span>
          Add New Quote
        </button>
        <a
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all"
          href="#settings"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-container/20 transition-all"
          href="#logout"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md">Logout</span>
        </a>
      </div>
    </aside>
  );
}
