"use client";

import { useState, useEffect } from "react";

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
  }, [quote, isOpen]);

  if (!isOpen) return null;

  // Handle select category dropdown change -> add chip
  const handleSelectCategory = (e) => {
    const catId = parseInt(e.target.value, 10);
    if (!catId) return;
    if (!selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
    e.target.value = "";
  };

  // Remove category chip
  const handleRemoveCategory = (catId) => {
    setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
  };

  // Image Upload / Drag & Drop handler for OCR Scan
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanFile(file);
    setScanPreview(URL.createObjectURL(file));
    setScanMessage("");
  };

  // Simulate OCR text extraction
  const handleRunScan = () => {
    if (!scanFile) return;
    setIsScanning(true);
    setScanMessage("Memindai dan mengekstrak teks dari gambar...");

    setTimeout(() => {
      setIsScanning(false);
      const extractedSample = `Teks Hasil Scan dari ${scanFile.name}: "Setiap kesulitan membawa benih kemudahan yang lebih besar."`;
      setText(extractedSample);
      setScanMessage("Berhasil mengekstrak teks! Berpindah ke tab Ketik Manual...");
      setTimeout(() => {
        setActiveTab("manual");
      }, 1000);
    }, 1500);
  };

  // Submit Handler
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-surface w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-primary/20 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
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
        <div className="flex border-b border-outline-variant/10 px-6 pt-2 bg-surface-container-lowest/30">
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`px-6 py-3 font-label-md transition-all cursor-pointer ${
              activeTab === "manual"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Ketik Manual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scan")}
            className={`px-6 py-3 font-label-md transition-all cursor-pointer ${
              activeTab === "scan"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Scan Gambar
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {activeTab === "manual" ? (
            <div className="p-6 space-y-6">
              {/* Quote Text Area */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author Field */}
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

                {/* Category Field */}
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
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px] pointer-events-none">
                      tag
                    </span>
                    <select
                      onChange={handleSelectCategory}
                      defaultValue=""
                      className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl py-3 pl-12 pr-10 text-on-surface appearance-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Pilih Kategori...
                      </option>
                      {categories.map((c) => (
                        <option
                          key={c.id}
                          value={c.id}
                          disabled={selectedCategoryIds.includes(c.id)}
                          className="bg-surface-container-high text-on-surface"
                        >
                          {c.name} {selectedCategoryIds.includes(c.id) ? "(Sudah dipilih)" : ""}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Chips Preview */}
              {selectedCategoryIds.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs text-on-surface-variant font-label-sm">
                    Kategori Terpilih ({selectedCategoryIds.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryIds.map((id) => {
                      const cat = categories.find((c) => c.id === id);
                      return (
                        <span
                          key={id}
                          className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-semibold flex items-center gap-1 transition-all"
                        >
                          {cat ? cat.name : `Kategori #${id}`}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(id)}
                            className="hover:text-error transition-colors ml-0.5 cursor-pointer flex items-center"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Favorite Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="favorite-toggle"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/50 bg-surface-container-highest/50 cursor-pointer"
                />
                <label htmlFor="favorite-toggle" className="text-sm font-medium text-on-surface cursor-pointer flex items-center gap-1.5">
                  <span className={`material-symbols-outlined text-lg ${isFavorite ? "text-amber-400 fill-1" : "text-on-surface-variant"}`}>
                    star
                  </span>
                  Tandai sebagai Quote Favorit
                </label>
              </div>
            </div>
          ) : (
            /* Tab: Scan Gambar */
            <div className="p-6 space-y-6 text-center">
              <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 bg-surface-container-lowest/30 hover:border-primary/40 transition-colors relative flex flex-col items-center justify-center gap-4">
                {scanPreview ? (
                  <div className="relative w-full max-h-56 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={scanPreview} alt="Scan preview" className="w-full h-auto object-contain max-h-56 rounded-xl mx-auto" />
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">document_scanner</span>
                    </div>
                    <div>
                      <p className="font-label-md text-on-surface">Unggah Gambar Kutipan</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Pilih foto atau screenshot teks kutipan untuk di-scan secara otomatis.
                      </p>
                    </div>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {scanFile && (
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRunScan}
                    disabled={isScanning}
                    className="indigo-gradient text-white font-label-md px-6 py-2.5 rounded-xl indigo-glow active-scale transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isScanning ? "sync" : "auto_fix_high"}
                    </span>
                    {isScanning ? "Memindai Gambar..." : "Ekstrak Teks (OCR)"}
                  </button>

                  {scanMessage && (
                    <p className="text-xs text-primary font-medium animate-pulse">{scanMessage}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-6 bg-surface-container-low/50 border-t border-outline-variant/10 flex flex-col md:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-variant/30 active-scale transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-10 py-3 rounded-lg indigo-gradient text-white font-label-md indigo-glow active-scale transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              {quote ? "Simpan Perubahan" : "Simpan Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
