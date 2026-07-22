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

export function hexToRgba(hex, alpha = 0.4) {
  if (!hex || !hex.startsWith("#")) return "rgba(192, 193, 255, 0.4)";
  let c = hex.substring(1);
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  if (c.length !== 6) return "rgba(192, 193, 255, 0.4)";
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CategoryForm({ onSave }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [customHex, setCustomHex] = useState("#c0c1ff");

  const isCustomSelected = selectedColor.id === "custom";

  const handleCustomColorChange = (hexValue) => {
    setCustomHex(hexValue);
    setSelectedColor({
      id: "custom",
      bgClass: hexValue,
      glow: hexToRgba(hexValue, 0.4),
      isCustom: true,
    });
  };

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
    setCustomHex("#c0c1ff");
  };

  const handleReset = () => {
    setName("");
    setSelectedColor(PRESET_COLORS[0]);
    setCustomHex("#c0c1ff");
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
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between">
              <span>Pilih Label Warna</span>
              {isCustomSelected && (
                <span className="text-xs text-primary font-mono font-normal">
                  {customHex.toUpperCase()}
                </span>
              )}
            </label>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Preset Color Palette */}
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

              {/* Custom Color Input Picker */}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                  isCustomSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0a0e1a] scale-110 border-primary"
                    : "border-outline-variant/50 hover:border-primary/50 opacity-90 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: isCustomSelected ? customHex : "transparent",
                  boxShadow: isCustomSelected ? `0 0 12px ${hexToRgba(customHex, 0.6)}` : undefined,
                }}
                title="Pilih Warna Custom"
              >
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                />
                <span className={`material-symbols-outlined text-base pointer-events-none ${isCustomSelected ? "text-slate-950 font-bold" : "text-on-surface-variant"}`}>
                  palette
                </span>
              </div>
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

