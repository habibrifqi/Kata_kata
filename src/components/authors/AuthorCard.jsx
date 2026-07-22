"use client";

import Link from "next/link";

export default function AuthorCard({ author, onEdit, onDelete }) {
  const {
    id,
    name,
    title,
    bio,
    avatarUrl,
    initials,
    tags = [],
    quotesCount = 0,
  } = author;

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col h-full group hover:-translate-y-1 transition-all duration-300">
      {/* Top Header Row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-1 flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-surface-container-high rounded-full flex items-center justify-center text-primary font-bold text-lg uppercase">
                {initials || name?.substring(0, 2) || "AU"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
              {name}
            </h3>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest block truncate">
              {title}
            </span>
          </div>
        </div>

        {/* Hover Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit?.(author)}
            className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            title="Edit Author"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button
            onClick={() => onDelete?.(id)}
            className="p-2 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
            title="Hapus Author"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>

      {/* Quote / Bio Snippet */}
      <p className="text-on-surface-variant text-sm line-clamp-3 mb-6 flex-grow italic leading-relaxed">
        {bio}
      </p>

      {/* Footer Tags & Stats */}
      <div className="space-y-4">
        {/* Topic Pills */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => {
            const isAlternate = idx % 2 === 1;
            return (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isAlternate
                    ? "bg-tertiary-container/10 text-tertiary border-tertiary/20"
                    : "bg-secondary-container/20 text-secondary border-secondary/10"
                }`}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Quote Count & Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <span className="text-on-surface font-bold text-sm">{quotesCount}</span>
            <span className="text-on-surface-variant text-xs">Quotes</span>
          </div>

          <Link
            href={`/quotes?author=${encodeURIComponent(name)}`}
            className="text-primary text-xs font-semibold hover:underline flex items-center gap-1 transition-all"
          >
            View Quotes{" "}
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
