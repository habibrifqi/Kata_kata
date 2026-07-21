"use client";

import { useState } from "react";

export const PRESET_COLORS = [
  { id: "primary", bgClass: "bg-primary", glow: "rgba(192, 193, 255, 0.6)" },
  { id: "secondary", bgClass: "bg-secondary", glow: "rgba(208, 188, 255, 0.6)" },
  { id: "tertiary", bgClass: "bg-tertiary", glow: "rgba(255, 183, 131, 0.6)" },
  { id: "error", bgClass: "bg-error", glow: "rgba(255, 180, 171, 0.6)" },
  { id: "emerald", bgClass: "bg-emerald-400", glow: "rgba(52, 211, 153, 0.6)" },
  { id: "sky", bgClass: "bg-sky-400", glow: "rgba(56, 189, 248, 0.6)" },
  { id: "amber", bgClass: "bg-amber-400", glow: "rgba(251, 191, 36, 0.6)" },
  { id: "rose", bgClass: "bg-rose-400", glow: "rgba(251, 113, 133, 0.6)" },
];

export default function CategoryForm({ onSave }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      colorBg: selectedColor.bgClass,
      glowColor: selectedColor.glow,
    });

    setName("");
    setSelectedColor(PRESET_COLORS[0]);
  };

  const handleReset = () => {
    setName("");
    setSelectedColor(PRESET_COLORS[0]);
  };

  return (
    <div className="glass-surface p-8 rounded-3xl relative overflow-hidden group border border-outline-variant/20 shadow-xl">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
          Tambah Kategori Baru
        </h3>
        <p className="font-body-md text-sm text-on-surface-variant mb-6">
          Mulai pengelompokkan koleksi kata-kata Anda hari ini.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div className="space-y-3">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant block uppercase tracking-wider">
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Produktivitas, Spiritual..."
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all font-body-md text-sm"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant block uppercase tracking-wider">
              Pilih Label Warna
            </label>
            <div className="flex flex-wrap gap-3 items-center min-h-[44px]">
              {PRESET_COLORS.map((c) => {
                const isSelected = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full ${c.bgClass} transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0a0e1a] scale-110 shadow-lg"
                        : "opacity-75 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{
                      boxShadow: isSelected ? `0 0 12px ${c.glow}` : `0 0 6px ${c.glow}`,
                    }}
                    aria-label={`Pilih warna ${c.id}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border border-outline-variant/40 text-on-surface-variant font-label-md text-sm font-semibold hover:bg-surface-variant/40 hover:text-on-surface active:scale-95 transition-all cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Simpan Kategori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
