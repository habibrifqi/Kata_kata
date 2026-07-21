"use client";

import { LayoutGrid, Sparkles, TrendingUp, Star } from "lucide-react";

export default function CategoryStats({ totalCategories = 12, totalQuotes = 342, topCategory = "Motivasi" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Kategori */}
      <div className="glass-surface p-6 rounded-2xl flex items-center gap-4 border border-outline-variant/20 hover:border-primary/30 transition-all">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <LayoutGrid className="w-6 h-6" />
        </div>
        <div>
          <div className="font-display-lg text-3xl font-extrabold text-primary">
            {totalCategories}
          </div>
          <div className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
            Total Kategori
          </div>
        </div>
      </div>

      {/* Kutipan Terarsip */}
      <div className="glass-surface p-6 rounded-2xl flex items-center gap-4 border border-outline-variant/20 hover:border-secondary/30 transition-all">
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <div className="font-display-lg text-3xl font-extrabold text-secondary">
            {totalQuotes}
          </div>
          <div className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
            Kutipan Terarsip
          </div>
        </div>
      </div>

      {/* Top Kategori */}
      <div className="glass-surface p-6 rounded-2xl flex items-center gap-4 overflow-hidden relative border border-outline-variant/20 hover:border-tertiary/30 transition-all">
        <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <div className="font-display-lg text-2xl md:text-3xl font-extrabold text-tertiary">
            {topCategory}
          </div>
          <div className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
            Top Kategori
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 pointer-events-none">
          <Star className="w-24 h-24 text-tertiary" />
        </div>
      </div>
    </div>
  );
}
