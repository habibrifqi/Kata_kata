"use client";

import { Quote, Heart, Share2 } from "lucide-react";

export default function QuoteCard({ quote, onToggleFavorite }) {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="glass-surface p-8 rounded-3xl glass-card-hover animate-fade-in relative overflow-hidden group"
      style={{ animationDelay: quote.delay }}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
      <Quote className="w-16 h-16 text-primary/20 absolute top-4 left-4 pointer-events-none stroke-1" />
      
      <div className="relative z-10">
        <p className="font-headline-sm text-lg md:text-xl italic mb-6 leading-relaxed">"{quote.text}"</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-label-md text-sm text-primary">— {quote.author}</p>
            <div className="mt-2 flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded-full tracking-wider">
                {quote.category}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleFavorite?.(quote.id)}
              className={`p-2 rounded-full hover:bg-surface-variant/50 transition-all cursor-pointer ${
                quote.isFavorite ? "text-error" : "text-on-surface-variant hover:text-error"
              }`}
              aria-label="Toggle favorite"
            >
              <Heart className="w-5 h-5" fill={quote.isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              className="p-2 rounded-full hover:bg-surface-variant/50 text-on-surface-variant hover:text-primary transition-all cursor-pointer"
              aria-label="Share quote"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
