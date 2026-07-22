"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import CategoryStats from "@/components/categories/CategoryStats";
import CategorySearch from "@/components/categories/CategorySearch";
import CategoryList from "@/components/categories/CategoryList";
import CategoryPagination from "@/components/categories/CategoryPagination";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryModal from "@/components/categories/CategoryModal";

const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Motivasi",
    colorBg: "bg-primary",
    glowColor: "rgba(192, 193, 255, 0.6)",
    quotesCount: 45,
    updatedAt: "2 Jam yang lalu",
  },
  {
    id: 2,
    name: "Teknologi",
    colorBg: "bg-tertiary",
    glowColor: "rgba(255, 183, 131, 0.6)",
    quotesCount: 28,
    updatedAt: "Dibuat kemarin",
  },
  {
    id: 3,
    name: "Filsafat",
    colorBg: "bg-error",
    glowColor: "rgba(255, 180, 171, 0.6)",
    quotesCount: 122,
    updatedAt: "3 Hari yang lalu",
  },
  {
    id: 4,
    name: "Cinta & Kasih",
    colorBg: "bg-secondary",
    glowColor: "rgba(208, 188, 255, 0.6)",
    quotesCount: 15,
    updatedAt: "Baru saja",
  },
  {
    id: 5,
    name: "Produktivitas",
    colorBg: "bg-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.6)",
    quotesCount: 54,
    updatedAt: "1 Hari yang lalu",
  },
  {
    id: 6,
    name: "Bisnis & Finansial",
    colorBg: "bg-sky-400",
    glowColor: "rgba(56, 189, 248, 0.6)",
    quotesCount: 89,
    updatedAt: "5 Jam yang lalu",
  },
  {
    id: 7,
    name: "Spiritual & Agama",
    colorBg: "bg-amber-400",
    glowColor: "rgba(251, 191, 36, 0.6)",
    quotesCount: 37,
    updatedAt: "4 Hari yang lalu",
  },
  {
    id: 8,
    name: "Psikologi",
    colorBg: "bg-rose-400",
    glowColor: "rgba(251, 113, 133, 0.6)",
    quotesCount: 62,
    updatedAt: "2 Hari yang lalu",
  },
  {
    id: 9,
    name: "Edukasi",
    colorBg: "bg-primary",
    glowColor: "rgba(192, 193, 255, 0.6)",
    quotesCount: 41,
    updatedAt: "6 Hari yang lalu",
  },
  {
    id: 10,
    name: "Seni & Sastra",
    colorBg: "bg-tertiary",
    glowColor: "rgba(255, 183, 131, 0.6)",
    quotesCount: 19,
    updatedAt: "1 Minggu yang lalu",
  },
  {
    id: 11,
    name: "Kepemimpinan",
    colorBg: "bg-secondary",
    glowColor: "rgba(208, 188, 255, 0.6)",
    quotesCount: 73,
    updatedAt: "3 Jam yang lalu",
  },
  {
    id: 12,
    name: "Gaya Hidup",
    colorBg: "bg-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.6)",
    quotesCount: 25,
    updatedAt: "5 Hari yang lalu",
  },
];

const ITEMS_PER_PAGE = 4;

export default function CategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Filtered categories based on search query
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
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
    validCurrentPage * ITEMS_PER_PAGE
  );

  // Compute stats
  const totalCategories = categories.length;
  const totalQuotes = categories.reduce((sum, c) => sum + (c.quotesCount || 0), 0);
  const topCategoryItem = categories.length
    ? [...categories].sort((a, b) => b.quotesCount - a.quotesCount)[0]
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

  const handleDeleteCategory = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  const handleSaveCategory = (data) => {
    if (data.id) {
      // Edit existing
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === data.id
            ? {
                ...cat,
                name: data.name,
                colorBg: data.colorBg,
                glowColor: data.glowColor,
                updatedAt: "Baru saja",
              }
            : cat
        )
      );
    } else {
      // Create new category
      const newCategory = {
        id: Date.now(),
        name: data.name,
        colorBg: data.colorBg,
        glowColor: data.glowColor,
        quotesCount: 0,
        updatedAt: "Baru saja",
      };
      setCategories((prev) => [newCategory, ...prev]);
      setCurrentPage(1);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-sans overflow-x-hidden w-full">
      {/* Animated Shader Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" />

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

          {/* Stats Overview */}
          <CategoryStats
            totalCategories={totalCategories}
            totalQuotes={totalQuotes}
            topCategory={topCategoryName}
          />

          {/* Category Search */}
          <CategorySearch
            value={searchQuery}
            onChange={setSearchQuery}
          />

          {/* Category List Table */}
          <CategoryList
            categories={paginatedCategories}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteCategory}
          />

          {/* Pagination */}
          <CategoryPagination
            currentPage={validCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />

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
    </div>
  );
}
