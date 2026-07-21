"use client";

import { Home as HomeIcon, Quote, ScanText, User } from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface-container/90 backdrop-blur-lg border-t border-outline-variant/20 rounded-t-xl lg:hidden">
      <a className="flex flex-col items-center justify-center text-primary scale-110 transition-transform" href="#home">
        <HomeIcon className="w-5 h-5" />
        <span className="font-label-sm text-xs mt-0.5">Home</span>
      </a>
      <a className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors" href="#quotes">
        <Quote className="w-5 h-5" />
        <span className="font-label-sm text-xs mt-0.5">Quotes</span>
      </a>
      <a className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors" href="#scan">
        <ScanText className="w-5 h-5" />
        <span className="font-label-sm text-xs mt-0.5">Scan</span>
      </a>
      <a className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors" href="#profile">
        <User className="w-5 h-5" />
        <span className="font-label-sm text-xs mt-0.5">Profile</span>
      </a>
    </nav>
  );
}
