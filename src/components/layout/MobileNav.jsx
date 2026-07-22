"use client";

import Link from "next/link";

export default function MobileNav({ activeMenu = "Categories" }) {
  const items = [
    { name: "Home", icon: "home", href: "/" },
    { name: "Quotes", icon: "format_quote", href: "/quotes" },
    { name: "Categories", icon: "category", href: "/categories" },
    { name: "Authors", icon: "person", href: "/authors" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full rounded-t-xl lg:hidden bg-surface-container/90 backdrop-blur-lg border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-50 flex justify-around items-center h-16 px-4">
      {items.map((item) => {
        const isActive = activeMenu === item.name || activeMenu === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive
                ? "text-primary scale-110 translate-y-[-2px]"
                : "text-on-surface-variant/70 hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-label-sm">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
