"use client";

import { Heart, Edit, Trash2 } from "lucide-react";

export default function QuoteCard({
  quote,
  viewMode = "grid",
  onToggleFavorite,
  onEdit,
  onDelete
}) {
  const categoriesList = Array.isArray(quote.categories)
    ? quote.categories.map((c) => (typeof c === "object" ? c.name : c))
    : quote.category
    ? [typeof quote.category === "object" ? quote.category.name : quote.category]
    : [];

  const authorName = typeof quote.author === "object" && quote.author !== null
    ? quote.author.name
    : quote.author || "Anonim";

  const authorRole = typeof quote.author === "object" && quote.author !== null
    ? quote.author.title || "Author"
    : quote.role || "Author";

  const authorAvatarUrl = typeof quote.author === "object" && quote.author !== null
    ? quote.author.avatarUrl || quote.avatarUrl
    : quote.avatarUrl;

  const getCategoryBadgeStyle = (category) => {
    switch (category?.toLowerCase()) {
      case "motivasi":
        return "bg-primary/10 text-primary";
      case "bisnis":
        return "bg-tertiary/10 text-tertiary";
      case "cinta":
        return "bg-secondary/10 text-secondary";
      case "islami":
        return "bg-primary/10 text-primary";
      case "filosofi":
        return "bg-secondary/10 text-secondary";
      default:
        return "bg-surface-variant text-on-surface-variant";
    }
  };

  const renderAvatar = () => {
    if (authorAvatarUrl) {
      return (
        <img
          src={authorAvatarUrl}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover border border-outline-variant/30"
        />
      );
    }

    if (quote.avatarInitials) {
      return (
        <div className="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center font-bold text-tertiary text-sm">
          {quote.avatarInitials}
        </div>
      );
    }

    if (quote.avatarGradient) {
      return <div className={`w-10 h-10 rounded-full ${quote.avatarGradient}`} />;
    }

    return (
      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-sm">
        {authorName?.slice(0, 2).toUpperCase() || "??"}
      </div>
    );
  };

  if (viewMode === "list") {
    return (
      <div className="quote-card glass-surface p-6 rounded-2xl relative flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-all duration-300">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {categoriesList.map((cat, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-md font-label-sm text-xs uppercase tracking-wider font-semibold ${getCategoryBadgeStyle(cat)}`}
              >
                {cat}
              </span>
            ))}
          </div>
          <blockquote className="my-2">
            <p className="font-headline-sm text-lg text-on-surface leading-relaxed italic">
              "{quote.text}"
            </p>
          </blockquote>
          <div className="flex items-center gap-3">
            {renderAvatar()}
            <div>
              <p className="font-label-md text-sm font-semibold text-on-surface">{authorName}</p>
              <p className="font-label-sm text-xs text-on-surface-variant">{authorRole}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <button
            onClick={() => onToggleFavorite?.(quote.id)}
            className={`p-2.5 rounded-full bg-surface-container-highest/80 transition-colors cursor-pointer ${
              quote.isFavorite ? "text-primary" : "text-on-surface hover:text-primary"
            }`}
            aria-label="Favorite"
          >
            <Heart className="w-5 h-5" fill={quote.isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => onEdit?.(quote)}
            className="p-2.5 rounded-full bg-surface-container-highest/80 text-on-surface hover:text-secondary transition-colors cursor-pointer"
            aria-label="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete?.(quote.id)}
            className="p-2.5 rounded-full bg-surface-container-highest/80 text-on-surface hover:text-error transition-colors cursor-pointer"
            aria-label="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-card glass-surface p-6 rounded-2xl relative flex flex-col group transition-all duration-300 min-h-[260px]">
      {/* Quote Hover Actions */}
      <div className="quote-actions absolute top-4 right-4 flex gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
        <button
          onClick={() => onToggleFavorite?.(quote.id)}
          className={`p-2 bg-surface-container-highest/80 rounded-full transition-colors cursor-pointer ${
            quote.isFavorite ? "text-primary" : "text-on-surface hover:text-primary"
          }`}
          aria-label="Favorite"
        >
          <Heart className="w-5 h-5" fill={quote.isFavorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => onEdit?.(quote)}
          className="p-2 bg-surface-container-highest/80 rounded-full text-on-surface hover:text-secondary transition-colors cursor-pointer"
          aria-label="Edit"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete?.(quote.id)}
          className="p-2 bg-surface-container-highest/80 rounded-full text-on-surface hover:text-error transition-colors cursor-pointer"
          aria-label="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Category Badges */}
      <div className="mb-4 flex flex-wrap gap-2 pr-24">
        {categoriesList.map((cat, idx) => (
          <span
            key={idx}
            className={`px-3 py-1 rounded-md font-label-sm text-xs uppercase tracking-wider font-semibold ${getCategoryBadgeStyle(cat)}`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Quote Body */}
      <blockquote className="flex-1 mb-6">
        <p className="font-headline-sm text-on-surface leading-relaxed italic">"{quote.text}"</p>
      </blockquote>

      {/* Author Footer */}
      <div className="flex items-center gap-3 mt-auto">
        {renderAvatar()}
        <div>
          <p className="font-label-md text-sm font-semibold text-on-surface">{authorName}</p>
          <p className="font-label-sm text-xs text-on-surface-variant">{authorRole}</p>
        </div>
      </div>
    </div>
  );
}
