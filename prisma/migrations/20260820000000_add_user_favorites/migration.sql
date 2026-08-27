-- Remove global favorite state. Favorites belong to users.
ALTER TABLE "quotes" DROP COLUMN IF EXISTS "isFavorite";

CREATE TABLE "user_favorites" (
    "userId" INTEGER NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("userId", "quoteId"),
    CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_favorites_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_favorites_quoteId_idx" ON "user_favorites"("quoteId");
