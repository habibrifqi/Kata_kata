"use client";

export default function CategoryList({ categories, onEdit, onDelete }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="glass-surface rounded-2xl p-12 text-center border border-outline-variant/20 mb-12">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-3xl">category</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-1">Kategori Tidak Ditemukan</h3>
        <p className="text-on-surface-variant text-sm">Tidak ada kategori yang cocok dengan pencarian Anda.</p>
      </div>
    );
  }

  return (
    <div className="glass-surface rounded-2xl overflow-hidden mb-12">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Topik & Warna</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Jumlah Kutipan</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Terakhir Diperbarui</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-surface-variant/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${cat.colorBg || "bg-primary"}`}
                      style={{
                        boxShadow: `0 0 8px ${cat.glowColor || "rgba(192,193,255,0.6)"}`,
                      }}
                    />
                    <span className="font-body-md text-body-md font-semibold text-on-surface">
                      {cat.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                    {cat.quotesCount} <span className="text-[10px] opacity-60">quotes</span>
                  </span>
                </td>
                <td className="px-6 py-5 font-label-sm text-label-sm text-on-surface-variant">
                  {cat.updatedAt}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(cat)}
                      className="p-2 rounded-lg hover:bg-secondary/10 text-secondary transition-all cursor-pointer"
                      title="Edit"
                      aria-label={`Edit ${cat.name}`}
                    >
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(cat.id)}
                      className="p-2 rounded-lg hover:bg-error/10 text-error transition-all cursor-pointer"
                      title="Hapus"
                      aria-label={`Hapus ${cat.name}`}
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
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
