"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExploreHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#13131b]/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        {/* Brand & Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight hover:opacity-90 transition-opacity"
          >
            KataKata
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
          <Link
            href="/login/oke"
            className="px-4 py-2 text-on-surface-variant font-label-md hover:text-primary transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/login/oke"
            className="bg-gradient-to-r from-primary-container to-secondary-container text-white px-5 py-2 rounded-lg font-label-md hover:opacity-90 transition-opacity shadow-lg shadow-primary-container/20"
          >
            Sign Up
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
              Login
            </Link>
            <Link
              href="/login/oke"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-gradient-to-r from-primary-container to-secondary-container text-white px-5 py-2.5 rounded-lg font-label-md shadow-lg shadow-primary-container/20"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
