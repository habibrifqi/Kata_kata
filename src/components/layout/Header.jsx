"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header({
  showSearch = false,
  searchPlaceholder = "Cari...",
  searchValue,
  onSearchChange,
}) {
  return (
    <header className="fixed top-0 right-0 z-40 bg-background/60 backdrop-blur-md flex justify-between items-center h-16 px-4 sm:px-6 lg:px-gutter lg:left-[260px] left-0 border-b border-outline-variant/10 max-w-full">
      <div className="flex items-center gap-4">
        <Link href="/" className="lg:hidden flex items-center">
          <Image
            src="/logo/logo_5.png"
            alt="KataKata Logo"
            width={140}
            height={40}
            className="h-auto max-h-9 w-auto object-contain brightness-130 contrast-105 filter drop-shadow-[0_0_12px_rgba(192,193,255,0.25)] transition-all hover:brightness-150"
            priority
          />
        </Link>
        {showSearch && (
          <div className="relative max-w-md w-full hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-on-surface font-label-md text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={searchPlaceholder}
              type="text"
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          aria-label="Account Profile"
        >
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
