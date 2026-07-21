"use client";

import QuoteCard from "./QuoteCard";

export default function RecentQuotes({ quotes, onToggleFavorite }) {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-end mb-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <div>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">Quotes Terbaru</h3>
          <p className="text-on-surface-variant font-label-md text-sm">Koleksi kurasi terakhir Anda.</p>
        </div>
        <a className="text-primary font-label-md text-sm hover:underline" href="#all-quotes">Lihat Semua</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} onToggleFavorite={onToggleFavorite} />
        ))}
      </div>
    </section>
  );
}
