"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import CategoryFilters from "@/components/quotes/CategoryFilters";
import QuoteCard from "@/components/quotes/QuoteCard";
import EmptyState from "@/components/quotes/EmptyState";
import Pagination from "@/components/quotes/Pagination";

const INITIAL_QUOTES = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    role: "Tech Visionary",
    categories: ["Motivasi", "Teknologi"],
    isFavorite: false,
    avatarGradient: "bg-gradient-to-br from-primary to-secondary",
  },
  {
    id: 2,
    text: "Kesenjangan antara ide dan implementasi adalah di mana kegagalan paling sering terjadi.",
    author: "Ahmad Kasim",
    role: "Entrepreneur",
    categories: ["Bisnis", "Motivasi"],
    isFavorite: true,
    avatarInitials: "AK",
  },
  {
    id: 3,
    text: "Love is not about how many days, months, or years you have been together.",
    author: "Unknown Author",
    role: "Philosopher",
    categories: ["Cinta", "Filosofi"],
    isFavorite: false,
    avatarGradient: "bg-surface-container-highest",
  },
  {
    id: 4,
    text: "Sesungguhnya bersama kesulitan ada kemudahan.",
    author: "Al-Insyirah: 6",
    role: "Holy Quran",
    categories: ["Islami", "Motivasi"],
    isFavorite: false,
    avatarInitials: "QS",
  },
  {
    id: 5,
    text: "Jangan pernah menyerah, karena hal-hal besar butuh waktu.",
    author: "Motivator X",
    role: "Speaker",
    categories: ["Motivasi"],
    isFavorite: false,
    avatarGradient: "bg-tertiary-fixed-dim",
  },
  {
    id: 6,
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    role: "Greek Philosopher",
    categories: ["Filosofi"],
    isFavorite: false,
    avatarGradient: "bg-secondary-fixed",
  },
];

export default function QuotesPage() {
  const [quotes, setQuotes] = useState(INITIAL_QUOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to extract categories array safely
  const getCategories = (q) =>
    Array.isArray(q.categories)
      ? q.categories
      : q.category
      ? [q.category]
      : [];

  // Filter logic for multi-category matching
  const filteredQuotes = quotes.filter((q) => {
    const cats = getCategories(q);

    const matchesCategory =
      activeCategory === "Semua" ||
      cats.some((c) => c.toLowerCase() === activeCategory.toLowerCase());

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      q.text.toLowerCase().includes(query) ||
      q.author.toLowerCase().includes(query) ||
      cats.some((c) => c.toLowerCase().includes(query)) ||
      (q.role && q.role.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isFavorite: !q.isFavorite } : q)),
    );
  };

  const handleDelete = (id) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEdit = (quote) => {
    alert(`Edit quote: "${quote.text}"`);
  };

  const handleAddNewQuote = () => {
    const newText = prompt("Masukkan teks quote baru:");
    if (!newText) return;
    const newAuthor = prompt("Masukkan nama author:") || "Anonymous";
    const rawCategories =
      prompt(
        "Masukkan kategori (dapat lebih dari satu dipisah koma, contoh: Motivasi, Bisnis):"
      ) || "Motivasi";

    const parsedCategories = rawCategories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const newQuote = {
      id: Date.now(),
      text: newText,
      author: newAuthor,
      role: "Contributor",
      categories: parsedCategories.length ? parsedCategories : ["Motivasi"],
      isFavorite: false,
      avatarInitials: newAuthor.slice(0, 2).toUpperCase(),
    };

    setQuotes((prev) => [newQuote, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Desktop Sidebar */}
      <Sidebar activeMenu="Quotes" />

      {/* Main Content Wrapper */}
      <main className="lg:ml-[260px] min-h-screen relative pb-24">
        {/* Top Header Bar */}
        <Header
          searchPlaceholder="Cari quote..."
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
                onClick={handleAddNewQuote}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah</span>
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

          {/* Quotes Grid / List / Empty State */}
          {filteredQuotes.length > 0 ? (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredQuotes.map((quote) => (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    viewMode={viewMode}
                    onToggleFavorite={toggleFavorite}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={12}
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
    </div>
  );
}
