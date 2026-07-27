"use client";

export default function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  isDeleting = false,
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-surface w-full max-w-md rounded-2xl p-6 shadow-2xl border border-outline-variant/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center shrink-0 border border-error/20">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-background">Confirm Delete</h3>
            <p className="text-xs text-on-surface-variant">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant mb-6">
          Apakah Anda yakin ingin menghapus user <strong className="text-on-background">{user.name}</strong> ({user.email})?
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant text-sm font-semibold hover:bg-surface-variant/40 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-error text-on-error font-bold text-sm shadow-lg shadow-error/20 hover:bg-error/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">delete</span>
                <span>Delete User</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
