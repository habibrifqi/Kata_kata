"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";

export default function Header({
  userAvatar,
  searchPlaceholder = "Search quotes...",
  searchValue,
  onSearchChange
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="fixed top-0 right-0 z-40 flex justify-between items-center h-16 px-gutter lg:left-[260px] left-0 bg-background/60 backdrop-blur-md border-b border-outline-variant/10">
      <h2 className="font-headline-md text-2xl font-bold text-primary lg:hidden ml-4">KataKata</h2>
      
      <div className="relative max-w-md w-full hidden md:block">
        <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
          searchFocused ? "text-primary" : "text-on-surface-variant"
        }`} />
        <input
          className={`w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-on-surface transition-all duration-300 font-label-md text-sm outline-none ${
            searchFocused ? "ring-2 ring-primary/50 shadow-[0_0_12px_rgba(99,102,241,0.3)]" : ""
          }`}
          placeholder={searchPlaceholder}
          type="text"
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>
      
      <div className="flex items-center gap-4 mr-4">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary/20">
          <img
            className="w-full h-full object-cover"
            alt="A professional avatar portrait"
            src={userAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuANfKQwI9-YwZgRpbiWESzYx62wd-fcBXyg3_qOZBsADTH21xx59P4asLLviQfUAZrbB_b2bVDULBdcKrEhGLR_gOSs6WKNlmSQeOhIbtgg9QFn7on0rn6gfqo20cgCxCUY8QODYwFGnoQZGTvjTVmW5z1rTQ7g2XCEn2NPgDSa2Z23YM0RDpQkPJgVXvTBhxN3BeK4vY3kVV7MzvSUxWQR7aBHKq2yJEKI2c9veyArj-mT2wZ0pv-Ch_hflBP2jo41L6Pxvj_o-HA"}
          />
        </div>
      </div>
    </header>
  );
}
