"use client";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Data?",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  confirmLabel = "Hapus Permanen",
  cancelLabel = "Batal",
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="glass-surface w-full max-w-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-error/20 text-center animate-in zoom-in duration-300 relative my-auto">
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-error/15 text-error flex items-center justify-center mx-auto mb-5 border border-error/30 shadow-lg shadow-error/10">
          <span className="material-symbols-outlined text-3xl">delete_forever</span>
        </div>

        {/* Modal Title & Body */}
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">
          {title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-variant/30 font-label-md text-label-md transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-error text-on-error font-label-md text-label-md shadow-lg shadow-error/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-xl animate-spin">
                  progress_activity
                </span>
                <span>Menghapus...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
