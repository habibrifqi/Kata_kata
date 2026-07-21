"use client";

import Link from "next/link";
import { Home as HomeIcon, Quote, Layers, User } from "lucide-react";

export default function MobileNav({ activeMenu = "Home" }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface-container/90 backdrop-blur-lg border-t border-outline-variant/20 rounded-t-xl lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <Link
        className={`flex flex-col items-center justify-center transition-all ${
          activeMenu === "Dashboard" || activeMenu === "Home"
            ? "text-primary scale-110"
            : "text-on-surface-variant/70 hover:text-primary"
        }`}
        href="/"
      >
        <HomeIcon className="w-5 h-5" />
        <span className="font-label-sm text-xs mt-0.5">Home</span>
      </Link>
      <Link
        className={`flex flex-col items-center justify-center transition-all ${
          activeMenu === "Quotes"
            ? "text-primary scale-110"
            : "text-on-surface-variant/70 hover:text-primary"
        }`}
        href="/quotes"
      >
        <Quote className="w-5 h-5" />
        <span className="font-label-sm text-xs mt-0.5">Quotes</span>
      </Link>
      <Link
        className={`flex flex-col items-center justify-center transition-all ${
          activeMenu === "Categories"
            ? "text-primary scale-110"
            : "text-on-surface-variant/70 hover:text-primary"
        }`}
        href="/categories"
      >
        <Layers className="w-5 h-5" />
        <span className="font-label-sm text-xs mt-0.5">Categories</span>
      </Link>
      <Link
        className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-all"
        href="#profile"
      >
        <User className="w-5 h-5" />
        <span className="font-label-sm text-xs mt-0.5">Profile</span>
      </Link>
    </nav>
  );
}
