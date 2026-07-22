"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import AuthorGrid from "@/components/authors/AuthorGrid";
import AuthorPagination from "@/components/authors/AuthorPagination";
import AuthorModal from "@/components/authors/AuthorModal";
import ConfirmModal from "@/components/common/ConfirmModal";

const INITIAL_AUTHORS = [
  {
    id: 1,
    name: "Marcus Aurelius",
    title: "Stoic Philosopher",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmyi6H02opu8mkBnYH1m_6jLmhfaY4MKMc7z9cYHNl8lgcOjcul7Lp2JIxPM0RXc6kcdF_EBl3Ov2YfvXquQw4UUXyVBwUFLsDtIjxCWnOSgZDXT67C1nbtAiMngn3DT318h0Fur4Cs9HynVUdsyPsOHkvjafTiwptrMl7Gx-_l2b5pQuooZAQuncaayDWfbZC3RBveggd7wqN9Uq37sdJUprkQg8a89-5UA0ktCEijhlztEXf_kxx999NAzQKVXU6Qsqa3VjGWtc",
    bio: '"Waste no more time arguing about what a good man should be. Be one." A Roman emperor and Stoic philosopher who ruled from 161 to 180 AD.',
    tags: ["Philosophy", "Stoicism", "Leadership"],
    quotesCount: 124,
  },
  {
    id: 2,
    name: "Maya Angelou",
    title: "Poet & Civil Rights Activist",
    initials: "MK",
    bio: '"I\'ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel."',
    tags: ["Wisdom", "Inspiration", "Literature"],
    quotesCount: 86,
  },
  {
    id: 3,
    name: "Steve Jobs",
    title: "Co-founder of Apple Inc.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIQUuUI05_0BahsLLuo8peBD_AeomkEsFLEJi1Xby62HaXJaafgf9f-sTClUdiRqsz8K83dT0Fc9gHDCsfURQ6VBG0jxEb1ClWoJ3k2KlNAl4Vuvz_Lvbw0HEdMbrbZ4kd2bEyMvSFTvH9hVw009pah7ivszPFF_X8CtET99k9zhIAIaKXYXJSZPELnWXjGMVH2fSiAcbt9EstekTsBBHy7zZZB77ycYIOm0T1gryAYetAaGqe0wPYVbgDuU34NDKjXE4DRLv6TCc",
    bio: '"The only way to do great work is to love what you do. If you haven\'t found it yet, keep looking. Don\'t settle."',
    tags: ["Innovation", "Creativity", "Design"],
    quotesCount: 210,
  },
  {
    id: 4,
    name: "Eckhart Tolle",
    title: "Spiritual Teacher",
    initials: "ET",
    bio: '"The primary cause of unhappiness is never the situation but your thoughts about it. Awareness is the greatest agent for change."',
    tags: ["Spirituality", "Mindfulness", "Presence"],
    quotesCount: 52,
  },
  {
    id: 5,
    name: "Virginia Woolf",
    title: "English Writer",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBO3f02LzB1jWpAz5Ge3lO_mxIxU4PBbxtRsv3TUA62ZJvgdYiVIo1Ab-zbCmu8kBE6ToQHnmzJlJRilVQYsIqUcFno9zfSEBnZE9HbZSJ1o8MKNVPMTrwR4XwAkCdJN5zW8Lgk6iczTSr6pMmyH5mRNfwQKZM6SsHoRATi73J53XKLRZgkdJgsIwTCSOO5F3YW0zeKhzVv8zqD8u2ueOurRh61LeBdr2_0HrWVlemaobAelTYTrEbuvt0j2Mv16inMOUEKmIVAYlY",
    bio: '"For most of history, Anonymous was a woman." A pioneer in the use of stream of consciousness as a narrative device.',
    tags: ["Literature", "Feminism", "Modernism"],
    quotesCount: 41,
  },
];

export default function AuthorsPage() {
  const [authors, setAuthors] = useState(INITIAL_AUTHORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  // Delete Confirmation State
  const [deletingAuthorId, setDeletingAuthorId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filtered Authors
  const filteredAuthors = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      a.bio.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Handlers
  const handleOpenAddModal = () => {
    setEditingAuthor(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (author) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    setDeletingAuthorId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingAuthorId) {
      setAuthors(authors.filter((a) => a.id !== deletingAuthorId));
      setIsDeleteModalOpen(false);
      setDeletingAuthorId(null);
    }
  };

  const handleSaveAuthor = (authorData) => {
    if (editingAuthor) {
      setAuthors(
        authors.map((a) => (a.id === authorData.id ? { ...a, ...authorData } : a))
      );
    } else {
      setAuthors([authorData, ...authors]);
    }
  };

  const targetAuthor = authors.find((a) => a.id === deletingAuthorId);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-sans overflow-x-hidden w-full">
      {/* SideNavBar */}
      <Sidebar activeMenu="Authors" />

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
              <h2 className="font-display-lg text-display-lg font-extrabold text-on-surface tracking-tight">
                Manage Authors
              </h2>
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

          {/* Authors Bento Grid */}
          <AuthorGrid
            authors={filteredAuthors}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onAddNew={handleOpenAddModal}
          />

          {/* Pagination */}
          <AuthorPagination
            currentPage={currentPage}
            totalPages={1}
            totalItems={124}
            itemsPerPage={5}
            onPageChange={(page) => setCurrentPage(page)}
          />
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
          setDeletingAuthorId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Author?"
        message={
          targetAuthor
            ? `Apakah Anda yakin ingin menghapus author "${targetAuthor.name}"? Tindakan ini tidak dapat dibatalkan.`
            : "Apakah Anda yakin ingin menghapus author ini?"
        }
        confirmLabel="Hapus Permanen"
        cancelLabel="Batal"
      />
    </div>
  );
}
