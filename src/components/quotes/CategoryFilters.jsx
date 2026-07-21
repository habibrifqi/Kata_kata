"use client";

export const DEFAULT_CATEGORIES = [
  "Semua",
  "Motivasi",
  "Islami",
  "Cinta",
  "Bisnis",
  "Teknologi",
  "Filosofi"
];

export default function CategoryFilters({
  categories = DEFAULT_CATEGORIES,
  activeCategory = "Semua",
  onSelectCategory
}) {
  return (
    <div className="flex overflow-x-auto gap-3 pb-4 mb-8 custom-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory?.(cat)}
            className={`px-5 py-2 rounded-full font-label-md text-sm whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? "bg-primary text-on-primary font-bold shadow-[0_0_12px_rgba(192,193,255,0.3)]"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
