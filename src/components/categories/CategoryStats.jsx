"use client";

export default function CategoryStats({ totalCategories = 12, totalQuotes = 342, topCategory = "Motivasi" }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-stack_lg">
      {/* Total Kategori */}
      <div className="glass-surface p-4 sm:p-6 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined">grid_view</span>
        </div>
        <div className="min-w-0">
          <div className="font-display-lg-mobile text-display-lg-mobile font-bold text-primary truncate">
            {totalCategories}
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Total Kategori
          </div>
        </div>
      </div>

      {/* Kutipan Terarsip */}
      <div className="glass-surface p-4 sm:p-6 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <div className="min-w-0">
          <div className="font-display-lg-mobile text-display-lg-mobile font-bold text-secondary truncate">
            {totalQuotes}
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Kutipan Terarsip
          </div>
        </div>
      </div>

      {/* Top Kategori */}
      <div className="glass-surface p-4 sm:p-6 rounded-2xl flex items-center gap-4 overflow-hidden relative sm:col-span-2 lg:col-span-1">
        <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
          <span className="material-symbols-outlined">trending_up</span>
        </div>
        <div className="min-w-0">
          <div className="font-display-lg-mobile text-display-lg-mobile font-bold text-tertiary truncate max-w-[180px]">
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
