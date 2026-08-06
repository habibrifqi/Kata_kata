"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * SearchableSelect — Custom searchable multi-select dropdown
 * Sepenuhnya menggunakan design system yang ada (glass, dark mode, CSS tokens).
 *
 * Props:
 *  - options: [{ id, name }]
 *  - selectedIds: number[]
 *  - onChange: (ids: number[]) => void
 *  - placeholder?: string
 *  - searchPlaceholder?: string
 *  - label?: string
 */
export default function SearchableSelect({
  options = [],
  selectedIds = [],
  onChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus input search saat dropdown terbuka
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter options berdasarkan search query
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleOption = useCallback(
    (id) => {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter((sid) => sid !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    },
    [selectedIds, onChange]
  );

  const handleRemoveChip = useCallback(
    (id, e) => {
      e.stopPropagation();
      onChange(selectedIds.filter((sid) => sid !== id));
    },
    [selectedIds, onChange]
  );

  const selectedOptions = options.filter((o) => selectedIds.includes(o.id));

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-h-[48px] bg-surface-container-highest/50 border rounded-xl px-3 py-2 text-left flex flex-wrap items-center gap-1.5 transition-all cursor-pointer outline-none ${
          isOpen
            ? "border-primary/50 ring-4 ring-primary/10"
            : "border-outline-variant/20 hover:border-outline-variant/40"
        }`}
      >
        {/* Icon */}
        <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mr-1">
          tag
        </span>

        {/* Chips yang sudah dipilih */}
        {selectedOptions.length > 0 ? (
          selectedOptions.map((opt) => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-[12px] font-semibold shrink-0"
            >
              {opt.name}
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => handleRemoveChip(opt.id, e)}
                className="material-symbols-outlined text-[13px] hover:text-error transition-colors cursor-pointer leading-none"
              >
                close
              </span>
            </span>
          ))
        ) : (
          <span className="text-on-surface-variant text-sm">{placeholder}</span>
        )}

        {/* Chevron */}
        <span
          className={`material-symbols-outlined text-on-surface-variant ml-auto shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-[200] mt-2 rounded-xl border border-outline-variant/20 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            background: "rgba(19, 19, 27, 0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-outline-variant/10">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                search
              </span>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-surface-container-high/60 border border-outline-variant/15 rounded-lg py-2 pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Options List */}
          <ul className="max-h-64 overflow-y-auto py-1 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-on-surface-variant text-center italic">
                Tidak ada hasil untuk &ldquo;{searchQuery}&rdquo;
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => handleToggleOption(opt.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-on-surface hover:bg-surface-container-high/60"
                      }`}
                    >
                      {/* Checkbox-like indicator */}
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-outline-variant/40"
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-on-primary text-[13px] font-bold">
                            check
                          </span>
                        )}
                      </span>
                      <span>{opt.name}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {/* Footer: jumlah terpilih & clear all */}
          {selectedOptions.length > 0 && (
            <div className="px-4 py-2 border-t border-outline-variant/10 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                {selectedOptions.length} dipilih
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-primary hover:text-primary/70 font-semibold transition-colors cursor-pointer"
              >
                Hapus Semua
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
