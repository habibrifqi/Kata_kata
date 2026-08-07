"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import UserModal from "@/components/users/UserModal";
import DeleteUserModal from "@/components/users/DeleteUserModal";
import { useCurrentUser } from "@/lib/useCurrentUser";

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const { user: currentUser } = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    newThisMonthCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Users API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(ITEMS_PER_PAGE),
        ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
        ...(roleFilter !== "all" ? { role: roleFilter } : {}),
      });

      const res = await fetch(`/api/users?${params.toString()}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal mengambil data user dari server");
      }

      setUsers(result.data || []);
      setTotalItems(result.total || 0);
      setTotalPages(result.totalPages || 1);

      if (result.stats) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error("[UsersPage] fetchUsers error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Create & Update
  const handleSaveUser = async (formData) => {
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(editingUser?.id);
      const url = isEdit ? `/api/users/${editingUser.id}` : "/api/users";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal menyimpan data user");
      }

      showToast(
        isEdit ? "User berhasil diperbarui." : "User baru berhasil ditambahkan.",
        "success"
      );
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteUser = async () => {
    if (!deletingUser?.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${deletingUser.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal menghapus user");
      }

      showToast("User berhasil dihapus.", "success");
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Render role badge helper
  const renderRoleBadge = (role) => {
    switch (role) {
      case "superadmin":
        return (
          <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold border border-tertiary/20">
            Super Admin
          </span>
        );
      case "admin":
        return (
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
            Admin
          </span>
        );
      default:
        return (
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold border border-secondary/20">
            Writer
          </span>
        );
    }
  };

  // Format Date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const startRecord = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* SideNavBar */}
      <Sidebar activeMenu="Users" user={currentUser} />

      {/* TopNavBar */}
      <Header
        showSearch
        searchPlaceholder="Search system users, emails..."
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
      />

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav activeMenu="Profile" />

      {/* Main Content */}
      <main className="lg:ml-[260px] pt-24 pb-24 lg:pb-10 px-gutter min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-background tracking-tight">
                User Management
              </h2>
              <p className="text-on-surface-variant mt-1 text-sm md:text-base">
                Monitor and manage system users and their permissions.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
              className="bg-primary text-on-primary font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined">person_add</span>
              Add New User
            </button>
          </header>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stat 1: Total Users */}
            <div className="glass-surface p-6 rounded-2xl flex items-center justify-between shadow-lg">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">
                  Total Users
                </p>
                <h3 className="text-3xl font-bold text-on-background">
                  {stats.totalUsers.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
            </div>

            {/* Stat 2: Total Admins (Pengganti "Active Now") */}
            <div className="glass-surface p-6 rounded-2xl flex items-center justify-between shadow-lg">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">
                  Admins & Superadmins
                </p>
                <h3 className="text-3xl font-bold text-on-background">
                  {stats.adminCount.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary border border-tertiary/20">
                <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
              </div>
            </div>

            {/* Stat 3: New this month */}
            <div className="glass-surface p-6 rounded-2xl flex items-center justify-between shadow-lg">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">
                  New this month
                </p>
                <h3 className="text-3xl font-bold text-on-background">
                  +{stats.newThisMonthCount}
                </h3>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary border border-secondary/20">
                <span className="material-symbols-outlined text-2xl">trending_up</span>
              </div>
            </div>
          </div>

          {/* Users Table Container */}
          <div className="glass-surface rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/10">
            {/* Table Search/Filter Header */}
            <div className="p-6 border-b border-outline-variant/10 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-on-surface font-semibold">All Users</span>
                <span className="bg-surface-variant text-on-surface-variant px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {totalItems}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Role Filter Dropdown */}
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-sm pointer-events-none">
                    filter_list
                  </span>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-surface-container/60 border border-outline-variant/30 text-on-surface-variant hover:text-on-background text-sm rounded-lg pl-8 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="writer">Writer</option>
                  </select>
                </div>

                {/* Search Input (Mobile/Secondary) */}
                <div className="relative md:hidden w-40">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-surface-container/60 border border-outline-variant/30 text-xs text-on-surface rounded-lg pl-3 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="m-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined">error</span>
                  <span>{error}</span>
                </div>
                <button
                  onClick={fetchUsers}
                  className="text-xs underline font-semibold hover:opacity-80"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/50 text-on-surface-variant text-xs uppercase tracking-wider border-b border-outline-variant/10">
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Created Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                            progress_activity
                          </span>
                          <span className="text-sm">Memuat data pengguna...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-4xl opacity-50">
                            group_off
                          </span>
                          <p className="text-sm font-semibold text-on-background">
                            Tidak ada data pengguna ditemukan
                          </p>
                          <p className="text-xs">
                            Coba ubah kata kunci pencarian atau filter role.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((usr) => (
                      <tr
                        key={usr.id}
                        className="hover:bg-primary/5 transition-colors group"
                      >
                        {/* Avatar & Username */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {usr.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={usr.image}
                                alt={usr.name}
                                className="w-10 h-10 rounded-lg object-cover ring-1 ring-primary/20 border border-outline-variant/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary font-bold flex items-center justify-center ring-1 ring-primary/20">
                                {usr.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-on-background text-sm">
                                {usr.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-on-surface-variant text-sm">
                          {usr.email}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          {renderRoleBadge(usr.role)}
                        </td>

                        {/* Created Date */}
                        <td className="px-6 py-4 text-on-surface-variant text-sm">
                          {formatDate(usr.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-90 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingUser(usr);
                                setIsModalOpen(true);
                              }}
                              className="p-2 hover:bg-surface-variant/50 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              title="Edit user"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setDeletingUser(usr);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 hover:bg-error/10 rounded-lg text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                              title="Delete user"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-6 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-on-surface-variant text-xs font-medium">
                Showing <span className="text-on-background font-bold">{startRecord}-{endRecord}</span> of{" "}
                <span className="text-on-background font-bold">{totalItems}</span> users
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="p-2 rounded-lg border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:border-primary/50 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && p - prev > 1;
                      return (
                        <div key={p} className="flex items-center">
                          {showEllipsis && <span className="text-on-surface-variant px-1 text-xs">...</span>}
                          <button
                            onClick={() => setCurrentPage(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentPage === p
                                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                                : "hover:bg-surface-variant/50 text-on-surface-variant"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || isLoading}
                  className="p-2 rounded-lg border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:border-primary/50 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-10 right-6 sm:right-10 z-[100] transition-all duration-300 animate-slideUp">
          <div
            className={`glass-surface p-4 rounded-xl flex items-center gap-4 border-l-4 shadow-2xl ${
              toast.type === "error"
                ? "border-error bg-error/10 text-on-background"
                : "border-primary bg-primary/10 text-on-background"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                toast.type === "error" ? "bg-error/20 text-error" : "bg-primary/20 text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {toast.type === "error" ? "error" : "check_circle"}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-bold">{toast.type === "error" ? "Error" : "Success"}</p>
              <p className="text-on-surface-variant text-xs">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-on-surface-variant hover:text-on-background ml-2"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* User Add/Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSaveUser}
        initialData={editingUser}
        isSubmitting={isSubmitting}
      />

      {/* User Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleDeleteUser}
        user={deletingUser}
        isDeleting={isDeleting}
      />
    </div>
  );
}
