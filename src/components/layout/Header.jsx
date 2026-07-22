"use client";

import { useState } from "react";

export default function Header({
  showSearch = false,
  searchPlaceholder = "Cari...",
  searchValue,
  onSearchChange
}) {
  return (
    <header className="fixed top-0 right-0 z-40 bg-background/60 backdrop-blur-md flex justify-between items-center h-16 px-4 sm:px-6 lg:px-gutter lg:left-[260px] left-0 border-b border-outline-variant/10 max-w-full">
      <div className="flex items-center gap-4">
        <h2 className="font-headline-md text-headline-md font-bold text-primary lg:hidden">
          KataKata
        </h2>
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
