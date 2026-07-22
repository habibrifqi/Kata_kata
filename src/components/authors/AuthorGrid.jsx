"use client";

import AuthorCard from "./AuthorCard";
import AuthorPlaceholderCard from "./AuthorPlaceholderCard";

export default function AuthorGrid({
  authors = [],
  onEdit,
  onDelete,
  onAddNew,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {authors.map((author) => (
        <AuthorCard
          key={author.id}
          author={author}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      <AuthorPlaceholderCard onClick={onAddNew} />
    </div>
  );
}
