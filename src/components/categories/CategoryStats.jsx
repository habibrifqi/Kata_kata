"use client";

export default function CategoryStats({ totalCategories = 12, totalQuotes = 342, topCategory = "Motivasi" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-stack_lg">
      {/* Total Kategori */}
      <div className="glass-surface p-6 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">grid_view</span>
        </div>
        <div>
          <div className="font-display-lg-mobile text-display-lg-mobile font-bold text-primary">
            {totalCategories}
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Total Kategori
          </div>
        </div>
      </div>

      {/* Kutipan Terarsip */}
      <div className="glass-surface p-6 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <div>
          <div className="font-display-lg-mobile text-display-lg-mobile font-bold text-secondary">
            {totalQuotes}
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Kutipan Terarsip
          </div>
        </div>
      </div>

      {/* Top Kategori */}
      <div className="glass-surface p-6 rounded-2xl flex items-center gap-4 overflow-hidden relative">
        <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
          <span className="material-symbols-outlined">trending_up</span>
        </div>
        <div>
          <div className="font-display-lg-mobile text-display-lg-mobile font-bold text-tertiary truncate max-w-[150px]">
            {topCategory}
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Top Kategori
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 scale-150 pointer-events-none">
          <span className="material-symbols-outlined text-8xl">stars</span>
        </div>
      </div>
    </div>
  );
}
