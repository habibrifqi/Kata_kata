"use client";

import { useState, useMemo } from "react";

const INITIAL_QUOTES = [
  {
    id: 1,
    quote: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
    source: "Meditations",
    categories: [
      { name: "Stoicism", colorClass: "bg-secondary-container/20 text-secondary-fixed" },
      { name: "Action", colorClass: "bg-tertiary-container/20 text-tertiary-fixed" },
    ],
    isFeatured: true,
    gridClass: "lg:col-span-2 lg:row-span-2 p-8",
    textSize: "text-2xl md:text-3xl",
  },
  {
    id: 2,
    quote: "He who has a why to live for can bear almost any how.",
    author: "Friedrich Nietzsche",
    categories: [
      { name: "Meaning", colorClass: "bg-surface-container-highest text-on-surface-variant" },
    ],
    gridClass: "p-6",
    textSize: "text-xl",
  },
  {
    id: 3,
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    categories: [
      { name: "Ethics", colorClass: "bg-surface-container-highest text-on-surface-variant" },
    ],
    gridClass: "p-6",
    textSize: "text-xl",
  },
  {
    id: 4,
    quote: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    categories: [
      { name: "Stoicism", colorClass: "bg-secondary-container/20 text-secondary-fixed" },
      { name: "Mindset", colorClass: "bg-surface-container-highest text-on-surface-variant" },
    ],
    gridClass: "lg:col-span-2 p-6",
    textSize: "text-2xl",
  },
  {
    id: 5,
    quote: "To handle yourself, use your head; to handle others, use your heart.",
    author: "Eleanor Roosevelt",
    categories: [
      { name: "Leadership", colorClass: "bg-tertiary-container/20 text-tertiary-fixed" },
    ],
    gridClass: "p-6",
    textSize: "text-lg md:text-xl",
  },
];

const EXTRA_QUOTES = [
  {
    id: 6,
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    source: "Meditations",
    categories: [
      { name: "Stoicism", colorClass: "bg-secondary-container/20 text-secondary-fixed" },
      { name: "Mindset", colorClass: "bg-surface-container-highest text-on-surface-variant" },
    ],
    gridClass: "p-6",
    textSize: "text-xl",
  },
  {
    id: 7,
    quote: "No man is free who is not master of himself.",
    author: "Epictetus",
    source: "Discourses",
    categories: [
      { name: "Stoicism", colorClass: "bg-secondary-container/20 text-secondary-fixed" },
      { name: "Leadership", colorClass: "bg-tertiary-container/20 text-tertiary-fixed" },
    ],
    gridClass: "lg:col-span-2 p-6",
    textSize: "text-2xl",
  },
];

const CATEGORIES = ["All", "Stoicism", "Ethics", "Mindset", "Leadership"];

export default function ExploreClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [quotesList, setQuotesList] = useState(INITIAL_QUOTES);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const handleLoadMore = () => {
    setQuotesList((prev) => [...prev, ...EXTRA_QUOTES]);
    setHasLoadedMore(true);
  };

  const filteredQuotes = useMemo(() => {
    return quotesList.filter((q) => {
      const matchesCategory =
        selectedCategory === "All" ||
        q.categories.some(
          (c) => c.name.toLowerCase() === selectedCategory.toLowerCase()
        );

      const matchesSearch =
        !searchQuery.trim() ||
        q.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.source && q.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.categories.some((c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [quotesList, selectedCategory, searchQuery]);

  return (
    <main className="flex-grow z-10 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-12 md:py-20 flex flex-col gap-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto w-full gap-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
          Explore Wisdom
        </h1>

        {/* Search Input Box */}
        <div className="w-full relative group">
          <div className="search-focus flex items-center bg-[#111827] rounded-xl border border-outline-variant/50 px-4 py-3 transition-all duration-300 w-full">
            <span className="material-symbols-outlined text-outline mr-3">
              search
            </span>
            <input
              className="bg-transparent border-none outline-none text-on-surface font-body-md w-full placeholder:text-outline/70 focus:ring-0"
              placeholder="Search quotes, authors, or concepts..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary/10 border border-primary/30 text-primary"
                    : "bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Quotes Grid (Bento-style variation) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
        {filteredQuotes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-on-surface-variant font-body-md">
            Tidak ada kata-kata yang cocok dengan kriteria pencarian Anda.
          </div>
        ) : (
          filteredQuotes.map((item) => (
            <article
              key={item.id}
              className={`glass-card rounded-2xl flex flex-col justify-between group ${item.gridClass}`}
            >
              <div className="relative">
                {item.isFeatured && (
                  <span className="material-symbols-outlined text-4xl text-primary/20 absolute -top-4 -left-2 z-0">
                    format_quote
                  </span>
                )}
                <blockquote
                  className={`relative z-10 font-serif text-on-surface leading-relaxed mb-6 ${
                    item.isFeatured ? "text-2xl md:text-3xl" : item.textSize || "text-xl"
                  }`}
                >
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <div
                className={`flex items-end justify-between mt-auto border-t border-outline-variant/20 ${
                  item.isFeatured ? "pt-6" : "pt-4"
                }`}
              >
                <div>
                  <p
                    className={
                      item.isFeatured
                        ? "font-headline-sm text-headline-sm text-primary-fixed-dim"
                        : "font-label-md text-label-md text-primary-fixed-dim"
                    }
                  >
                    {item.author}
                  </p>
                  {item.source && (
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                      {item.source}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                  {item.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded-md font-label-sm text-[10px] tracking-wider uppercase ${cat.colorClass}`}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Load More Action */}
      {!hasLoadedMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 rounded-xl border border-outline-variant/50 text-on-surface-variant font-label-md hover:border-primary hover:text-primary transition-all duration-300 bg-surface-container-lowest cursor-pointer"
          >
            Load More Quotes
          </button>
        </div>
      )}
    </main>
  );
}
