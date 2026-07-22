"use client";

export default function CategorySearch({ value, onChange }) {
  return (
    <div className="mb-6 flex justify-end">
      <div className="flex items-center bg-surface-container-low/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-outline-variant/20 focus-within:ring-2 focus-within:ring-primary/40 transition-all w-full max-w-md shadow-lg">
        <span className="material-symbols-outlined text-on-surface-variant text-sm select-none">
          search
        </span>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari kategori..."
          className="bg-transparent border-none focus:ring-0 text-label-md font-label-md w-full text-on-surface placeholder:text-on-surface-variant/50 ml-2 outline-none"
        />
      </div>
    </div>
  );
}
