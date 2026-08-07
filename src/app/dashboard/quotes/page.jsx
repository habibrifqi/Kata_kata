"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import CategoryFilters from "@/components/quotes/CategoryFilters";
import QuoteCard from "@/components/quotes/QuoteCard";
import EmptyState from "@/components/quotes/EmptyState";
import Pagination from "@/components/quotes/Pagination";
import QuoteModal from "@/components/quotes/QuoteModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useCurrentUser } from "@/lib/useCurrentUser";

const ITEMS_PER_PAGE = 12;

export default function QuotesPage() {
  const { user } = useCurrentUser();
  const [quotes, setQuotes] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Quote Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);

  // Delete Modal State
  const [deletingQuote, setDeletingQuote] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Toast Helper ───────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Fetch Authors & Categories (for Modal Options) ───────────────────────
  const fetchMetadata = useCallback(async (userId) => {
    try {
      // Hanya ambil author milik user yang sedang login
      const authorParams = new URLSearchParams({ pageSize: "100" });
      if (userId) authorParams.set("userId", String(userId));

      const [resAuthors, resCategories] = await Promise.all([
        fetch(`/api/authors?${authorParams.toString()}`),
        fetch("/api/categories"),
      ]);

      if (resAuthors.ok) {
        const resultA = await resAuthors.json();
        if (resultA.success) setAuthors(resultA.data || []);
      }
      if (resCategories.ok) {
        const resultC = await resCategories.json();
        if (resultC.success) setCategories(resultC.data || []);
      }
    } catch (err) {
      console.error("[Fetch Metadata Error]:", err);
    }
  }, []);

  useEffect(() => {
    // Tunggu sampai user sudah dimuat sebelum fetch author
    if (user !== undefined) {
      fetchMetadata(user?.userId ?? null);
    }
  }, [fetchMetadata, user]);

  // ─── Fetch Quotes ────────────────────────────────────────────────────────────
  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(ITEMS_PER_PAGE),
        ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
        ...(activeCategory && activeCategory !== "Semua" ? { category: activeCategory } : {}),
      });

      const res = await fetch(`/api/quotes?${params.toString()}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal mengambil data quote");
      }

      setQuotes(result.data || []);
      setTotalItems(result.total ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (err) {
      console.error("[Fetch Quotes Error]:", err);
      setError(err.message || "Gagal memuat quotes");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, activeCategory]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Reset page to 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // ─── Modal Handlers ──────────────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setEditingQuote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quote) => {
    setEditingQuote(quote);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    const target = quotes.find((q) => q.id === id);
    if (target) {
      setDeletingQuote(target);
      setIsDeleteModalOpen(true);
    }
  };

  // ─── Toggle Favorite ────────────────────────────────────────────────────────
  const handleToggleFavorite = async (id) => {
    const target = quotes.find((q) => q.id === id);
    if (!target) return;

    try {
      const newStatus = !target.isFavorite;
      // Optimistic Update
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, isFavorite: newStatus } : q))
      );

      const res = await fetch(`/api/quotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: newStatus }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        // Rollback on fail
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, isFavorite: !newStatus } : q))
        );
        throw new Error(result.error || "Gagal memperbarui status favorit");
      }
    } catch (err) {
      console.error("[Toggle Favorite Error]:", err);
      showToast(err.message || "Gagal mengupdate favorit", "error");
    }
  };

  // ─── Save Quote (Create / Update) ───────────────────────────────────────────
  const handleSaveQuote = async (quoteData) => {
    try {
      if (quoteData.id) {
        // PUT /api/quotes/[id]
        const res = await fetch(`/api/quotes/${quoteData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: quoteData.text,
            authorId: quoteData.authorId,
            categoryIds: quoteData.categoryIds,
            isFavorite: quoteData.isFavorite,
          }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Gagal mengupdate quote");
        }
        showToast("Quote berhasil diupdate!", "success");
      } else {
        // POST /api/quotes
        const res = await fetch("/api/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: quoteData.text,
            authorId: quoteData.authorId,
            categoryIds: quoteData.categoryIds,
            isFavorite: quoteData.isFavorite,
          }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Gagal membuat quote");
        }
        showToast("Quote baru berhasil ditambahkan!", "success");
        setCurrentPage(1);
      }

      await fetchQuotes();
    } catch (err) {
      console.error("[Save Quote Error]:", err);
      showToast(err.message || "Gagal menyimpan quote", "error");
    }
  };

  // ─── Confirm Delete ─────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deletingQuote) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/quotes/${deletingQuote.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal menghapus quote");
      }

      showToast("Quote berhasil dihapus", "success");
      setIsDeleteModalOpen(false);
      setDeletingQuote(null);
      await fetchQuotes();
    } catch (err) {
      console.error("[Delete Quote Error]:", err);
      showToast(err.message || "Gagal menghapus quote", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[120] px-5 py-3 rounded-2xl shadow-xl font-label-md text-label-md flex items-center gap-3 backdrop-blur-md ${
            toast.type === "error"
              ? "bg-error/90 text-on-error border border-error/30"
              : "bg-primary-container/90 text-on-primary-container border border-primary/30"
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar activeMenu="Quotes" user={user} />

      {/* Main Content Wrapper */}
      <main className="lg:ml-[260px] min-h-screen relative pb-24">
        {/* Top Header Bar */}
        <Header
          searchPlaceholder="Cari quote atau penulis..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Canvas */}
        <div className="px-6 lg:px-10 pt-24 pb-8">
          {/* Page Title & View Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                Quotes Collection
              </h2>
              <p className="text-on-surface-variant font-body-md text-base mt-1">
                Manage and discover your curated inspirations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenAddModal}
                className="indigo-gradient text-white font-label-md px-6 py-3 rounded-xl indigo-glow active-scale transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Quote</span>
              </button>

              {/* View Switcher Toggle */}
              <div className="flex bg-surface-container rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-surface-container-highest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-surface-container-highest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  aria-label="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <CategoryFilters
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">warning</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={fetchQuotes}
                className="px-3 py-1 bg-error/20 hover:bg-error/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Loading / Quotes Grid / List / Empty State */}
          {isLoading ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-outline-variant/20 mb-12 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary">
                progress_activity
              </span>
              <p className="text-on-surface-variant text-sm font-medium">
                Memuat data quote...
              </p>
            </div>
          ) : quotes.length > 0 ? (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {quotes.map((quote) => (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    viewMode={viewMode}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              onClearSearch={() => {
                setSearchQuery("");
                setActiveCategory("Semua");
              }}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeMenu="Quotes" />

      {/* Quote Add / Edit Modal */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuote}
        quote={editingQuote}
        authors={authors}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingQuote(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Quote?"
        message={
          deletingQuote
            ? `Apakah Anda yakin ingin menghapus quote "${deletingQuote.text.slice(0, 50)}..."?`
            : "Apakah Anda yakin ingin menghapus quote ini?"
        }
        confirmLabel="Hapus Permanen"
        cancelLabel="Batal"
        isLoading={isDeleting}
      />
    </div>
  );
}
