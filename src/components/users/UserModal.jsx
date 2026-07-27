"use client";

import { useState } from "react";

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "writer",
    image: initialData?.image || "",
  }));

  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [error, setError] = useState("");

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setFormData({
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || "writer",
      image: initialData?.image || "",
    });
    setError("");
  }

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Nama user harus diisi.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email user harus diisi.");
      return;
    }
    setError("");
    onSubmit(formData);
  };

  const isEdit = Boolean(initialData?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-surface w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-outline-variant/20">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">
                {isEdit ? "manage_accounts" : "person_add"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-background">
                {isEdit ? "Edit User" : "Add New User"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {isEdit
                  ? "Perbarui informasi dan role pengguna."
                  : "Tambahkan pengguna baru ke sistem."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-background hover:bg-surface-variant/50 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Sterling"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-background placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Email Address <span className="text-error">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. alex.sterling@katakata.com"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-background placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            >
              <option value="writer" className="bg-surface-container text-on-background">
                Writer
              </option>
              <option value="admin" className="bg-surface-container text-on-background">
                Admin
              </option>
              <option value="superadmin" className="bg-surface-container text-on-background">
                Super Admin
              </option>
            </select>
          </div>

          {/* Image URL Field */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Avatar Image URL <span className="text-on-surface-variant/50 lowercase">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-background placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant text-sm font-semibold hover:bg-surface-variant/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-container disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEdit ? "Update User" : "Save User"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
