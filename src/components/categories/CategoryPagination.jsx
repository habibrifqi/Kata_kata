"use client";

export default function CategoryPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-12">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Halaman Sebelumnya"
      >
        <span className="material-symbols-outlined text-lg sm:text-xl">chevron_left</span>
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${idx}`} className="text-outline-variant px-1 select-none text-xs sm:text-sm">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-label-md text-xs sm:text-sm transition-all cursor-pointer ${
              isActive
                ? "bg-primary text-on-primary shadow-lg shadow-primary/20 font-bold"
                : "text-on-surface-variant hover:bg-surface-variant/50"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Halaman Selanjutnya"
      >
        <span className="material-symbols-outlined text-lg sm:text-xl">chevron_right</span>
      </button>
    </div>
  );
}
