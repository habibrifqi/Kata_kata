"use client";

export default function AuthorPagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 5,
  itemsPerPage = 5,
  onPageChange,
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate simple array of visible pages
  const pages = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pages.push(i);
  }

  return (
    <div className="mt-12 flex flex-col md:flex-row items-center justify-between glass-card p-4 rounded-xl gap-4">
      <span className="text-on-surface-variant text-xs font-medium">
        Showing {startItem}-{endItem} of {totalItems} authors
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div className="flex gap-1">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange?.(p)}
              className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
                currentPage === p
                  ? "bg-primary text-on-primary"
                  : "hover:bg-surface-container-high text-on-surface"
              }`}
            >
              {p}
            </button>
          ))}
          {totalPages > 5 && (
            <>
              <span className="px-2 text-on-surface-variant self-center text-sm">
                ...
              </span>
              <button
                onClick={() => onPageChange?.(totalPages)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-primary text-on-primary"
                    : "hover:bg-surface-container-high text-on-surface"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
