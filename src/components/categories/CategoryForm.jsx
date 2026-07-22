"use client";

import { useState } from "react";

export const PRESET_COLORS = [
  { id: "primary", bgClass: "bg-primary", glow: "rgba(192, 193, 255, 0.4)" },
  { id: "secondary", bgClass: "bg-secondary", glow: "rgba(208, 188, 255, 0.4)" },
  { id: "tertiary", bgClass: "bg-tertiary", glow: "rgba(255, 183, 131, 0.4)" },
  { id: "error", bgClass: "bg-error", glow: "rgba(255, 180, 171, 0.4)" },
  { id: "emerald", bgClass: "bg-emerald-400", glow: "rgba(52, 211, 153, 0.4)" },
  { id: "sky", bgClass: "bg-sky-400", glow: "rgba(56, 189, 248, 0.4)" },
  { id: "amber", bgClass: "bg-amber-400", glow: "rgba(251, 191, 36, 0.4)" },
  { id: "rose", bgClass: "bg-rose-400", glow: "rgba(251, 113, 133, 0.4)" },
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
    <div className="glass-surface p-5 sm:p-8 rounded-3xl relative overflow-hidden group">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />

      <div className="relative z-10">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
          Tambah Kategori Baru
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          Mulai pengelompokkan koleksi kata-kata Anda hari ini.
        </p>

        <form onSubmit={handleSubmit} onReset={handleReset} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-end">
          <div className="space-y-3 sm:space-y-4">
            <label className="font-label-md text-label-md text-on-surface-variant block">
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Produktivitas, Spiritual..."
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="font-label-md text-label-md text-on-surface-variant block">
              Pilih Label Warna
            </label>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {PRESET_COLORS.map((c) => {
                const isSelected = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`color-picker-btn w-8 h-8 rounded-full ${c.bgClass} transition-all cursor-pointer ${
                      isSelected
                        ? "active ring-2 ring-primary ring-offset-2 ring-offset-[#0a0e1a] scale-110"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ boxShadow: `0 0 10px ${c.glow}` }}
                    aria-label={`Pilih warna ${c.id}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-2 sm:mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant/30 transition-all cursor-pointer text-center"
            >
              Reset
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 sm:px-10 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
            >
              Simpan Kategori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
