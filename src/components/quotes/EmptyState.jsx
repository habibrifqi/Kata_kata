"use client";

import { SearchX } from "lucide-react";

export default function EmptyState({ onClearSearch }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="w-24 h-24 mb-6 rounded-full bg-surface-container flex items-center justify-center">
        <SearchX className="w-12 h-12 text-outline-variant" />
      </div>
      <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">No quotes found</h3>
      <p className="text-on-surface-variant font-body-md max-w-sm text-sm leading-relaxed">
        We couldn't find any quotes matching your search. Try different keywords or browse categories.
      </p>
      {onClearSearch && (
        <button
          onClick={onClearSearch}
          className="mt-6 px-6 py-2 text-primary font-label-md text-sm hover:underline cursor-pointer"
        >
          Clear Search
        </button>
      )}
    </div>
  );
}
