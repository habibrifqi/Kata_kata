"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import CategoryStats from "@/components/categories/CategoryStats";
import CategoryList from "@/components/categories/CategoryList";
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
    name: "Bisnis",
    colorBg: "bg-sky-400",
    glowColor: "rgba(56, 189, 248, 0.6)",
    quotesCount: 89,
    updatedAt: "5 Jam yang lalu",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Filtered categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Compute stats
  const totalCategories = categories.length;
  const totalQuotes = categories.reduce((sum, c) => sum + (c.quotesCount || 0), 0);
  const topCategoryItem = categories.length
    ? [...categories].sort((a, b) => b.quotesCount - a.quotesCount)[0]
    : null;
  const topCategoryName = topCategoryItem ? topCategoryItem.name : "-";

  // Actions
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
      // Create new
      const newCategory = {
        id: Date.now(),
        name: data.name,
        colorBg: data.colorBg,
        glowColor: data.glowColor,
        quotesCount: 0,
        updatedAt: "Baru saja",
      };
      setCategories((prev) => [newCategory, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Desktop Sidebar */}
      <Sidebar activeMenu="Categories" />

      {/* Main Content Wrapper */}
      <main className="lg:ml-[260px] min-h-screen relative pb-24 lg:pb-12">
        {/* Top Header Bar */}
        <Header
          searchPlaceholder="Cari kategori..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Page Content Container */}
        <div className="pt-24 px-6 lg:px-10 max-w-[1440px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                Kelola Kategori
              </h1>
              <p className="font-body-md text-sm md:text-base text-on-surface-variant mt-1">
                Organisir inspirasi Anda berdasarkan topik yang relevan.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-md text-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-container/20 self-start cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          {/* Stats Overview */}
          <CategoryStats
            totalCategories={totalCategories}
            totalQuotes={totalQuotes}
            topCategory={topCategoryName}
          />

          {/* Category List Table */}
          <CategoryList
            categories={filteredCategories}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteCategory}
          />

          {/* Inline Form Section (Add New) */}
          <CategoryForm onSave={handleSaveCategory} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
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
