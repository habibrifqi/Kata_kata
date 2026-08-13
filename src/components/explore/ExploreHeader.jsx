"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ExploreHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#13131b]/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        {/* Brand & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/logo_5.png"
              alt="KataKata Logo"
              width={140}
              height={40}
              className="h-auto max-h-9 w-auto object-contain brightness-130 contrast-105 filter drop-shadow-[0_0_12px_rgba(192,193,255,0.25)] transition-all hover:brightness-150"
              priority
            />
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/"
              className="text-primary font-bold border-b-2 border-primary pb-1 font-label-md"
            >
              Explore
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* <Link
            href="/login/oke"
            className="px-4 py-2 text-on-surface-variant font-label-md hover:text-primary transition-colors duration-200"
          >
            Contribute
          </Link> */}
          <Link
            href="/login/oke"
            className="bg-primary from-primary-container to-secondary-container text-on-primary px-5 py-2 rounded-lg font-label-md hover:opacity-90 transition-opacity shadow-lg shadow-primary-container/20"
          >
            Contribute
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-on-surface p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/20 bg-[#13131b]/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-primary font-bold text-base py-2 border-b border-outline-variant/10"
          >
            Explore
          </Link>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/login/oke"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label-md hover:text-primary"
            >
              Contribute
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
