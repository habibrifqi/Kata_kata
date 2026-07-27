"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import AuthorGrid from "@/components/authors/AuthorGrid";
import AuthorPagination from "@/components/authors/AuthorPagination";
import AuthorModal from "@/components/authors/AuthorModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useCurrentUser } from "@/lib/useCurrentUser";

const ITEMS_PER_PAGE = 10;

export default function AuthorsPage() {
  const { user } = useCurrentUser();
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  // Delete Confirmation State
  const [deletingAuthor, setDeletingAuthor] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Toast Helper ────────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Fetch Authors from API ───────────────────────────────────────────────────
  const fetchAuthors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(ITEMS_PER_PAGE),
        ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      });

      const res = await fetch(`/api/authors?${params.toString()}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal mengambil data author dari server");
      }

      setAuthors(result.data || []);
      setTotalItems(result.total ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (err) {
      console.error("[GET /api/authors Error]:", err);
      setError(err.message || "Gagal memuat author");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // Reset ke page 1 saat search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ─── Modal Handlers ───────────────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setEditingAuthor(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (author) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    const target = authors.find((a) => a.id === id);
    if (target) {
      setDeletingAuthor(target);
      setIsDeleteModalOpen(true);
    }
  };

  // ─── Save Author (POST / PUT) ─────────────────────────────────────────────────
  const handleSaveAuthor = async (authorData) => {
    try {
      if (authorData.id) {
        // PUT /api/authors/[id]
        const res = await fetch(`/api/authors/${authorData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: authorData.name,
            title: authorData.title,
            bio: authorData.bio,
            avatarUrl: authorData.avatarUrl,
            tags: authorData.tags,
          }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Gagal mengupdate author");
        }
        showToast("Author berhasil diupdate!", "success");
      } else {
        // POST /api/authors
        const res = await fetch("/api/authors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: authorData.name,
            title: authorData.title,
            bio: authorData.bio,
            avatarUrl: authorData.avatarUrl,
            tags: authorData.tags,
          }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Gagal membuat author");
        }
        showToast("Author baru berhasil ditambahkan!", "success");
        setCurrentPage(1);
      }

      await fetchAuthors();
    } catch (err) {
      console.error("[Save Author Error]:", err);
      showToast(err.message || "Gagal menyimpan author", "error");
    }
  };

  // ─── Confirm Delete (DELETE /api/authors/[id]) ───────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deletingAuthor) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/authors/${deletingAuthor.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal menghapus author");
      }

      showToast(`Author "${deletingAuthor.name}" berhasil dihapus`, "success");
      setIsDeleteModalOpen(false);
      setDeletingAuthor(null);
      await fetchAuthors();
    } catch (err) {
      console.error("[Delete Author Error]:", err);
      showToast(err.message || "Gagal menghapus author", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-sans overflow-x-hidden w-full">
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

      {/* SideNavBar */}
      <Sidebar activeMenu="Authors" user={user} />

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-[260px] pb-24 lg:pb-12 relative z-10 min-h-screen w-full max-w-full overflow-x-hidden">
        {/* TopNavBar Header with Search */}
        <Header
          showSearch
          searchPlaceholder="Search authors by name or biography..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Page Content Container */}
        <div className="mt-20 px-4 sm:px-6 md:px-gutter max-w-container_max_width mx-auto w-full">
          {/* Page Title & Add Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="font-display-lg text-display-lg font-extrabold text-on-surface tracking-tight">
                Manage Authors
              </h1>
              <p className="text-on-surface-variant mt-1">
                Curate and manage the voices behind the wisdom.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="indigo-gradient text-white px-6 py-3 rounded-xl font-label-md text-label-md flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start md:self-auto"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Author
            </button>
          </div>

          {/* Author Search (Mobile Only) */}
          <div className="md:hidden mb-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-10 pr-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                placeholder="Search authors..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">warning</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={fetchAuthors}
                className="px-3 py-1 bg-error/20 hover:bg-error/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Authors Bento Grid */}
          {isLoading ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-outline-variant/20 mb-12 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary">
                progress_activity
              </span>
              <p className="text-on-surface-variant text-sm font-medium">
                Memuat data author...
              </p>
            </div>
          ) : (
            <AuthorGrid
              authors={authors}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onAddNew={handleOpenAddModal}
            />
          )}

          {/* Pagination */}
          {!isLoading && (
            <AuthorPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav activeMenu="Authors" />

      {/* Author Add / Edit Modal */}
      <AuthorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAuthor}
        author={editingAuthor}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingAuthor(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Author?"
        message={
          deletingAuthor
            ? `Apakah Anda yakin ingin menghapus author "${deletingAuthor.name}"? Quote yang terkait akan tetap ada namun tidak lagi terhubung ke author ini.`
            : "Apakah Anda yakin ingin menghapus author ini?"
        }
        confirmLabel="Hapus Permanen"
        cancelLabel="Batal"
        isLoading={isDeleting}
      />
    </div>
  );
}
