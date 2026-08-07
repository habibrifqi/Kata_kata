"use client";

import { useState, useEffect, useRef } from "react";
import SearchableSelect from "@/components/ui/SearchableSelect";

export default function QuoteModal({
  isOpen,
  onClose,
  onSave,
  quote = null,
  authors = [],
  categories = [],
  onQuickAddCategory,
}) {
  const [activeTab, setActiveTab] = useState("manual"); // "manual" | "scan"
  const [text, setText] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Scan tab state
  const [scanFile, setScanFile] = useState(null);
  const [scanPreview, setScanPreview] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrDone, setOcrDone] = useState(false);

  // Ref for "upload ulang" hidden input
  const reuploadRef = useRef(null);

  // Populate state when opening modal or changing quote prop
  useEffect(() => {
    if (quote) {
      setText(quote.text || "");
      setAuthorId(quote.authorId ? String(quote.authorId) : "");
      if (Array.isArray(quote.categories)) {
        setSelectedCategoryIds(quote.categories.map((c) => (typeof c === "object" ? c.id : c)));
      } else {
        setSelectedCategoryIds([]);
      }
      setIsFavorite(quote.isFavorite || false);
    } else {
      setText("");
      setAuthorId("");
      setSelectedCategoryIds([]);
      setIsFavorite(false);
    }
    setActiveTab("manual");
    setScanFile(null);
    setScanPreview("");
    setIsScanning(false);
    setScanMessage("");
    setOcrProgress(0);
    setOcrDone(false);
  }, [quote, isOpen]);

  if (!isOpen) return null;


  // ─── Image Upload handler ────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanFile(file);
    setScanPreview(URL.createObjectURL(file));
    setScanMessage("");
    setOcrProgress(0);
    setOcrDone(false);
    setText("");
  };

  // "Upload Ulang" — reset scan dan buka dialog file
  const handleReupload = () => {
    setScanFile(null);
    setScanPreview("");
    setScanMessage("");
    setOcrProgress(0);
    setOcrDone(false);
    setText("");
    if (reuploadRef.current) {
      reuploadRef.current.value = "";
      reuploadRef.current.click();
    }
  };

  // ─── Real OCR via Tesseract.js (dynamic import, client-only) ─────────────────
  const handleRunScan = async () => {
    if (!scanFile) return;
    setIsScanning(true);
    setOcrDone(false);
    setOcrProgress(0);
    setScanMessage("Memuat mesin OCR...");

    try {
      const { createWorker } = await import("tesseract.js");

      const worker = await createWorker("ind+eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pct = Math.round((m.progress || 0) * 100);
            setOcrProgress(pct);
            setScanMessage(`Memindai teks... ${pct}%`);
          } else if (m.status === "loading tesseract core") {
            setScanMessage("Memuat mesin OCR...");
          } else if (m.status === "initializing tesseract") {
            setScanMessage("Menginisialisasi Tesseract...");
          } else if (m.status === "loading language traineddata") {
            setScanMessage("Memuat model bahasa (Indonesia + Inggris)...");
          } else if (m.status === "initializing api") {
            setScanMessage("Mempersiapkan API OCR...");
          }
        },
      });

      setScanMessage("Menganalisis gambar...");
      const {
        data: { text: extracted },
      } = await worker.recognize(scanFile);

      await worker.terminate();

      const cleanText = extracted.trim();
      if (cleanText) {
        setText(cleanText);
        setOcrProgress(100);
        setScanMessage("Teks berhasil diekstrak! Silakan edit jika perlu, lalu simpan.");
        setOcrDone(true);
      } else {
        setScanMessage("⚠ Tidak ada teks yang terdeteksi. Coba gambar lain yang lebih jelas.");
        setOcrProgress(0);
      }
    } catch (err) {
      console.error("[OCR Error]:", err);
      setScanMessage("✗ Gagal memindai. Pastikan gambar cukup jelas dan coba lagi.");
      setOcrProgress(0);
    } finally {
      setIsScanning(false);
    }
  };

  // ─── Submit Handler ──────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSave?.({
      id: quote?.id,
      text: text.trim(),
      authorId: authorId ? parseInt(authorId, 10) : null,
      categoryIds: selectedCategoryIds,
      isFavorite,
    });

    onClose();
  };

  // ─── Shared Author / Category / Favorite fields ──────────────────────────────
  const AuthorCategoryFields = (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Author */}
        <div className="space-y-2">
          <label className="font-label-sm text-on-surface-variant uppercase tracking-widest block">
            Penulis / Sumber
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px] pointer-events-none">
              person
            </span>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl py-3 pl-12 pr-10 text-on-surface appearance-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer"
            >
              <option value="">-- Tanpa Author / Anonim --</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id} className="bg-surface-container-high text-on-surface">
                  {a.name} {a.title ? `(${a.title})` : ""}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-label-sm text-on-surface-variant uppercase tracking-widest block">
              Kategori
            </label>
            {onQuickAddCategory && (
              <button
                type="button"
                onClick={onQuickAddCategory}
                className="text-primary font-label-sm hover:underline cursor-pointer"
              >
                + Buat Baru
              </button>
            )}
          </div>
          <SearchableSelect
            options={categories.map((c) => ({ id: c.id, name: c.name }))}
            selectedIds={selectedCategoryIds}
            onChange={setSelectedCategoryIds}
            placeholder="Pilih Kategori..."
            searchPlaceholder="Cari kategori..."
          />
        </div>
      </div>

      {/* Favorite Toggle */}
      <div className="flex items-center gap-3 pt-1">
        <input
          type="checkbox"
          id="favorite-toggle"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/50 bg-surface-container-highest/50 cursor-pointer"
        />
        <label
          htmlFor="favorite-toggle"
          className="text-sm font-medium text-on-surface cursor-pointer flex items-center gap-1.5"
        >
          <span className={`material-symbols-outlined text-lg ${isFavorite ? "text-amber-400 fill-1" : "text-on-surface-variant"}`}>
            star
          </span>
          Tandai sebagai Quote Favorit
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-primary/20 animate-in zoom-in duration-300 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50 shrink-0">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            {quote ? "Edit Kutipan" : "Tambah Kutipan Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/10 px-6 pt-2 bg-surface-container-lowest/30 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`px-5 py-3 font-label-md transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "manual"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            Ketik Manual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scan")}
            className={`px-5 py-3 font-label-md transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "scan"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">document_scanner</span>
            Scan Gambar
            <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold leading-none">
              OCR
            </span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} id="quote-form">

            {/* ── Tab: Manual ── */}
            {activeTab === "manual" ? (
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-widest block">
                    Teks Kutipan *
                  </label>
                  <textarea
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-40 bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl p-4 text-on-surface focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-body-md"
                    placeholder="Tuliskan kata-kata yang menginspirasi di sini..."
                  />
                </div>
                {AuthorCategoryFields}
              </div>
            ) : (
              /* ── Tab: Scan Gambar ── */
              <div className="p-6 space-y-5">

                {/* Upload / Preview Zone */}
                <div className="relative">
                  {scanPreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-outline-variant/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={scanPreview}
                        alt="Preview gambar untuk di-scan"
                        className="w-full max-h-52 object-contain bg-surface-container-lowest/60 block"
                      />
                      {/* Upload Ulang button overlay */}
                      <button
                        type="button"
                        onClick={handleReupload}
                        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/30 text-on-surface text-xs font-semibold backdrop-blur-sm hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-lg"
                      >
                        <span className="material-symbols-outlined text-[15px]">upload</span>
                        Upload Ulang
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="scan-file-input"
                      className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-outline-variant/30 rounded-2xl p-10 bg-surface-container-lowest/30 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">document_scanner</span>
                      </div>
                      <div className="text-center">
                        <p className="font-label-md text-on-surface">Unggah Gambar Kutipan</p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Pilih foto atau screenshot yang mengandung teks kutipan
                        </p>
                        <p className="text-xs text-primary/70 mt-1 font-medium">Klik di sini atau drag &amp; drop</p>
                      </div>
                    </label>
                  )}
                  {/* Primary file input (label target) */}
                  <input
                    id="scan-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {/* Secondary input for "upload ulang" button */}
                  <input
                    ref={reuploadRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Extract Button */}
                {scanFile && !isScanning && !ocrDone && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleRunScan}
                      className="indigo-gradient text-white font-label-md px-8 py-3 rounded-xl indigo-glow active-scale transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                    >
                      <span className="material-symbols-outlined text-lg">auto_fix_high</span>
                      Ekstrak Teks (OCR)
                    </button>
                  </div>
                )}

                {/* Progress Bar */}
                {isScanning && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] animate-spin">sync</span>
                        {scanMessage || "Memindai..."}
                      </span>
                      <span className="text-primary font-bold tabular-nums">{ocrProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-300"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Status message (setelah scan, bukan loading) */}
                {!isScanning && scanMessage && (
                  <div
                    className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm border ${
                      ocrDone
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : scanMessage.startsWith("⚠") || scanMessage.startsWith("✗")
                        ? "bg-error/10 border-error/20 text-error"
                        : "bg-surface-container/50 border-outline-variant/20 text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                      {ocrDone
                        ? "check_circle"
                        : scanMessage.startsWith("⚠") || scanMessage.startsWith("✗")
                        ? "warning"
                        : "info"}
                    </span>
                    <span>{scanMessage}</span>
                  </div>
                )}

                {/* Hasil OCR + fields (muncul setelah scan sukses) */}
                {ocrDone && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-label-sm text-on-surface-variant uppercase tracking-widest block">
                          Hasil Ekstraksi Teks *
                        </label>
                        <button
                          type="button"
                          onClick={handleReupload}
                          className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">upload</span>
                          Ganti Gambar
                        </button>
                      </div>
                      <textarea
                        required
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-36 bg-surface-container-highest/50 border border-primary/30 rounded-xl p-4 text-on-surface focus:border-primary/60 focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-body-md"
                        placeholder="Hasil scan akan muncul di sini..."
                      />
                      <p className="text-xs text-on-surface-variant">
                        Teks di atas bisa diedit sesuai kebutuhan sebelum disimpan.
                      </p>
                    </div>

                    {AuthorCategoryFields}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-surface-container-low/50 border-t border-outline-variant/10 flex flex-col md:flex-row justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-variant/30 active-scale transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="quote-form"
            disabled={isScanning || (activeTab === "scan" && !ocrDone && !text.trim())}
            className="px-10 py-3 rounded-lg indigo-gradient text-white font-label-md indigo-glow active-scale transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {quote ? "Simpan Perubahan" : "Simpan Quote"}
          </button>
        </div>
      </div>
    </div>
  );
}
