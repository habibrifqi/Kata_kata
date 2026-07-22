"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import CategoryStats from "@/components/categories/CategoryStats";
import CategorySearch from "@/components/categories/CategorySearch";
import CategoryList from "@/components/categories/CategoryList";
import CategoryPagination from "@/components/categories/CategoryPagination";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryModal from "@/components/categories/CategoryModal";
import ConfirmModal from "@/components/common/ConfirmModal";

const ITEMS_PER_PAGE = 4;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Delete Confirm Modal state
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch categories from API backend
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.error || "Gagal mengambil data kategori dari server",
        );
      }

      setCategories(result.data || []);
    } catch (err) {
      console.error("[GET /api/categories Error]:", err);
      setError(err.message || "Gagal memuat kategori");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filtered categories based on search query
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCategories = filteredCategories.slice(
    (validCurrentPage - 1) * ITEMS_PER_PAGE,
    validCurrentPage * ITEMS_PER_PAGE,
  );

  // Compute stats
  const totalCategories = categories.length;
  const totalQuotes = categories.reduce(
    (sum, c) => sum + (c.quotesCount || 0),
    0,
  );
  const topCategoryItem = categories.length
    ? [...categories].sort(
        (a, b) => (b.quotesCount || 0) - (a.quotesCount || 0),
      )[0]
    : null;
  const topCategoryName = topCategoryItem ? topCategoryItem.name : "-";

  // Modal Actions
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  // Trigger Delete Modal
  const handleOpenDeleteModal = (id) => {
    const target = categories.find((c) => c.id === id);
    if (target) {
      setDeletingCategory(target);
      setIsDeleteModalOpen(true);
    }
  };

  // Confirm Delete Category (DELETE /api/categories/[id])
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal menghapus kategori");
      }

      showToast(
        `Kategori "${deletingCategory.name}" berhasil dihapus`,
        "success",
      );
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error("[Delete Category Error]:", err);
      showToast(err.message || "Gagal menghapus kategori", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Category (POST or PUT /api/categories)
  const handleSaveCategory = async (data) => {
    try {
      if (data.id) {
        // PUT /api/categories/[id]
        const res = await fetch(`/api/categories/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            colorBg: data.colorBg,
            glowColor: data.glowColor,
          }),
        });
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Gagal mengupdate kategori");
        }

        showToast("Kategori berhasil diupdate!", "success");
      } else {
        // POST /api/categories
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            colorBg: data.colorBg,
            glowColor: data.glowColor,
          }),
        });
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Gagal membuat kategori");
        }

        showToast("Kategori baru berhasil ditambahkan!", "success");
        setCurrentPage(1);
      }

      await fetchCategories();
    } catch (err) {
      console.error("[Save Category Error]:", err);
      showToast(err.message || "Gagal menyimpan kategori", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-sans overflow-x-hidden w-full">
      {/* Animated Shader Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[120] px-5 py-3 rounded-2xl shadow-xl font-label-md text-label-md flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-5 duration-300 ${
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
      <Sidebar activeMenu="Categories" />

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-[260px] pb-24 lg:pb-12 relative z-10 min-h-screen w-full max-w-full overflow-x-hidden">
        {/* TopNavBar */}
        <Header />

        {/* Page Content */}
        <div className="mt-20 px-4 sm:px-6 md:px-gutter max-w-container_max_width mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-stack_lg gap-4">
            <div>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface font-extrabold break-words">
                Kelola Kategori
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Organisir inspirasi Anda berdasarkan topik yang relevan.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="bg-primary-container text-on-primary-container px-5 py-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-container/20 w-full sm:w-auto self-start sm:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Tambah Kategori</span>
            </button>
          </div>

          {/* Error Banner if any */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">warning</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={fetchCategories}
                className="px-3 py-1 bg-error/20 hover:bg-error/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Stats Overview */}
          <CategoryStats
            totalCategories={totalCategories}
            totalQuotes={totalQuotes}
            topCategory={topCategoryName}
          />

          {/* Category Search */}
          <CategorySearch value={searchQuery} onChange={setSearchQuery} />

          {/* Loading or Category List Table */}
          {isLoading ? (
            <div className="glass-surface rounded-2xl p-12 text-center border border-outline-variant/20 mb-12 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary">
                progress_activity
              </span>
              <p className="text-on-surface-variant text-sm font-medium">
                Memuat data kategori...
              </p>
            </div>
          ) : (
            <CategoryList
              categories={paginatedCategories}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          )}

          {/* Pagination */}
          {!isLoading && (
            <CategoryPagination
              currentPage={validCurrentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}

          {/* Inline Form Section (Add New) */}
          <CategoryForm onSave={handleSaveCategory} />
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav activeMenu="Categories" />

      {/* Edit / Add Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori?"
        message={
          deletingCategory
            ? `Apakah Anda yakin ingin menghapus kategori "${deletingCategory.name}"? Tindakan ini tidak dapat dibatalkan.`
            : "Apakah Anda yakin ingin menghapus kategori ini?"
        }
        confirmLabel="Hapus Permanen"
        cancelLabel="Batal"
        isLoading={isDeleting}
      />
    </div>
  );
}
