"use client";

export default function PopularCategories({ categories }) {
  return (
    <section className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
      <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-6">Kategori Populer</h3>
      <div className="flex flex-wrap gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`glass-surface px-6 py-3 rounded-full flex items-center gap-3 border border-outline-variant/30 ${cat.borderHover} transition-all cursor-pointer group`}
          >
            <span className={`w-2 h-2 rounded-full ${cat.color} ${cat.shadow}`}></span>
            <span className={`font-label-md text-sm text-on-surface ${cat.textHover} transition-colors`}>{cat.name}</span>
            <span className="text-on-surface-variant font-label-sm text-xs bg-surface-variant px-2 py-0.5 rounded-full">{cat.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
