"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";

const INITIAL_FAVORITES = [
  {
    id: 1,
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    categories: ["Art", "Design"],
  },
  {
    id: 2,
    text: "The details are not the details. They make the design.",
    author: "Charles Eames",
    categories: ["Architecture"],
  },
  {
    id: 3,
    text: "I shut my eyes in order to see.",
    author: "Paul Gauguin",
    categories: ["Art", "Vision"],
  },
];

export default function FavoritesClient({ user }) {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const categories = ["All Categories", ...new Set(favorites.flatMap((item) => item.categories))];
  const visibleFavorites = useMemo(() => {
    const query = search.trim().toLowerCase();
    return favorites.filter((item) => {
      const matchesSearch = !query || `${item.text} ${item.author}`.toLowerCase().includes(query);
      const matchesCategory = category === "All Categories" || item.categories.includes(category);
      return matchesSearch && matchesCategory;
    });
  }, [category, favorites, search]);

  return (
    <div className="min-h-screen bg-background text-on-background antialiased selection:bg-primary selection:text-on-primary">
      <Sidebar activeMenu="Favorites" user={user} />
      <main className="relative min-h-screen pb-24 lg:ml-[260px]">
        <Header />
        <div className="mx-auto mt-20 w-full max-w-container_max_width px-4 sm:px-6 md:px-gutter">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h1 className="font-display-lg-mobile text-display-lg-mobile font-extrabold text-on-surface md:font-display-lg md:text-display-lg">
                Favorite Quotes
              </h1>
              <p className="mt-1 text-body-md text-on-surface-variant">
                Manage your curated collection of inspiring words.
              </p>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <SearchInput value={search} onChange={setSearch} />
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-variant">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name || "User profile"} className="h-full w-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-primary">account_circle</span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="md:hidden"><SearchInput value={search} onChange={setSearch} /></div>
            <div className="flex w-full gap-3 overflow-x-auto pb-2 sm:w-auto">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-lg border px-4 py-2 text-label-sm transition-colors ${
                    category === item
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-outline-variant/30 bg-surface-variant/50 text-on-surface hover:bg-surface-variant"
                  }`}
                >
                  {item === "All Categories" && <span className="material-symbols-outlined mr-2 text-[16px]">filter_list</span>}
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {visibleFavorites.map((item) => (
              <article key={item.id} className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container/60 p-4 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(192,193,255,0.15)] sm:flex-row sm:p-5">
                <div className="flex-1 pr-8">
                  <p className="font-serif text-body-lg italic leading-relaxed text-on-surface">&quot;{item.text}&quot;</p>
                  <p className="mt-3 flex items-center gap-2 text-label-md text-on-surface-variant">
                    <span className="h-px w-4 bg-outline-variant" />{item.author}
                  </p>
                </div>
                <div className="flex w-full flex-col justify-between gap-4 border-t border-outline-variant/10 pt-3 sm:w-auto sm:items-end sm:border-t-0 sm:pt-0">
                  <div className="flex flex-wrap justify-end gap-2">
                    {item.categories.map((tag, index) => <span key={tag} className={`rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${index === 0 ? "border-primary-container/20 bg-primary-container/10 text-primary" : "border-tertiary-container/20 bg-tertiary-container/10 text-tertiary"}`}>{tag}</span>)}
                  </div>
                </div>
                <button
                  onClick={() => setFavorites((items) => items.filter((favorite) => favorite.id !== item.id))}
                  className="absolute bottom-3 right-3 rounded-full p-2 text-primary transition-colors hover:bg-surface-variant"
                  title="Remove from favorites"
                  aria-label={`Remove ${item.author} quote from favorites`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </button>
              </article>
            ))}
          </div>

          {visibleFavorites.length === 0 && <div className="glass-card rounded-xl p-12 text-center text-on-surface-variant">No favorite quotes found.</div>}
        </div>
      </main>
      <MobileNav activeMenu="Favorites" />
    </div>
  );
}

function SearchInput({ value, onChange }) {
  return <div className="search-focus relative w-full sm:w-64"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-outline-variant/30 bg-[#111827] py-2 pl-10 pr-4 text-sm text-on-surface outline-none" placeholder="Search favorites..." type="search" /></div>;
}
