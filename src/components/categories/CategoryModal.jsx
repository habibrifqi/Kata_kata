"use client";

import { useState, useEffect } from "react";
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="glass-surface w-full max-w-md p-5 sm:p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-300 relative my-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {category ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-lg hover:bg-surface-variant/30 cursor-pointer"
            aria-label="Tutup modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant block">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Kategori"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant block">
              Warna Tema
            </label>
            <div className="flex gap-3 items-center flex-wrap py-1">
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
                        : "opacity-50 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ boxShadow: isSelected ? `0 0 10px ${c.glow}` : undefined }}
                    aria-label={`Warna ${c.id}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-variant/30 transition-all font-label-md cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              {category ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
