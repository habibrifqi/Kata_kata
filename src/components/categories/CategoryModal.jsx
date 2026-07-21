"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { PRESET_COLORS } from "./CategoryForm";

export default function CategoryModal({ isOpen, onClose, onSave, category = null }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      const matched = PRESET_COLORS.find((c) => c.bgClass === category.colorBg) || PRESET_COLORS[0];
      setSelectedColor(matched);
    } else {
      setName("");
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: category?.id,
      name: name.trim(),
      colorBg: selectedColor.bgClass,
      glowColor: selectedColor.glow,
      quotesCount: category ? category.quotesCount : 0,
      updatedAt: "Baru saja",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="glass-surface w-full max-w-md p-8 rounded-3xl shadow-2xl border border-outline-variant/30 relative animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">
            {category ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-lg hover:bg-surface-variant/40 cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kategori..."
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
              Warna Tema
            </label>
            <div className="flex flex-wrap gap-3 items-center py-2">
              {PRESET_COLORS.map((c) => {
                const isSelected = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full ${c.bgClass} transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 shadow-lg"
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                    aria-label={`Pilih warna ${c.id}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-outline-variant/40 text-on-surface hover:bg-surface-variant/30 transition-all font-label-md text-sm font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all cursor-pointer"
            >
              {category ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
