"use client";

import { Edit2, Trash2, Layers } from "lucide-react";

export default function CategoryList({ categories, onEdit, onDelete }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="glass-surface rounded-2xl p-12 text-center border border-outline-variant/20 mb-12">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-1">Kategori Tidak Ditemukan</h3>
        <p className="text-on-surface-variant text-sm">Tidak ada kategori yang cocok dengan pencarian Anda.</p>
      </div>
    );
  }

  return (
    <div className="glass-surface rounded-2xl overflow-hidden mb-12 border border-outline-variant/20 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10 bg-surface-container-low/40">
              <th className="px-6 py-4 font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Topik & Warna
              </th>
              <th className="px-6 py-4 font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Jumlah Kutipan
              </th>
              <th className="px-6 py-4 font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Terakhir Diperbarui
              </th>
              <th className="px-6 py-4 font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-surface-variant/30 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${cat.colorBg || "bg-primary"}`}
                      style={{
                        boxShadow: `0 0 10px ${cat.glowColor || "rgba(192,193,255,0.6)"}`,
                      }}
                    />
                    <span className="font-body-md text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center gap-1 font-label-md text-xs font-semibold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/10">
                    {cat.quotesCount} <span className="text-[10px] opacity-60">quotes</span>
                  </span>
                </td>
                <td className="px-6 py-5 font-label-sm text-sm text-on-surface-variant">
                  {cat.updatedAt}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(cat)}
                      className="p-2 rounded-lg hover:bg-secondary/15 text-secondary hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      title="Edit Kategori"
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(cat.id)}
                      className="p-2 rounded-lg hover:bg-error/15 text-error hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      title="Hapus Kategori"
                      aria-label={`Hapus ${cat.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
