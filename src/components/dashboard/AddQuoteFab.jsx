"use client";

import { Plus } from "lucide-react";

export default function AddQuoteFab({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-8 lg:bottom-12 lg:right-12 z-50 flex items-center gap-2 bg-gradient-to-br from-primary to-secondary text-on-primary font-bold px-6 py-4 rounded-2xl shadow-[0_8px_25px_rgba(192,193,255,0.4)] hover:scale-110 active:scale-95 transition-all group cursor-pointer"
      aria-label="Tambah Quote"
    >
      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      <span className="font-label-md text-sm">Tambah Quote</span>
    </button>
  );
}
