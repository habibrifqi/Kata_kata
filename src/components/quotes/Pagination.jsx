"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 12,
  onPageChange
}) {
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {[1, 2, 3].map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-md text-sm cursor-pointer transition-all ${
            currentPage === page
              ? "bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(192,193,255,0.3)]"
              : "text-on-surface-variant hover:bg-surface-variant"
          }`}
        >
          {page}
        </button>
      ))}

      <span className="text-outline-variant px-2">...</span>

      <button
        onClick={() => onPageChange?.(totalPages)}
        className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-md text-sm cursor-pointer transition-all ${
          currentPage === totalPages
            ? "bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(192,193,255,0.3)]"
            : "text-on-surface-variant hover:bg-surface-variant"
        }`}
      >
        {totalPages}
      </button>

      <button
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
