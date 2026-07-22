"use client";

export default function AuthorPlaceholderCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-outline-variant/30 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-surface-variant/20 hover:border-primary/50 transition-all group cursor-pointer h-full min-h-[320px]"
    >
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4 shadow-md">
        <span className="material-symbols-outlined text-[32px]">add_circle</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
        Add New Author
      </h3>
      <p className="text-on-surface-variant text-center text-sm mt-2 max-w-[220px]">
        Expand the collection of wisdom from the world&apos;s thinkers.
      </p>
    </div>
  );
}
