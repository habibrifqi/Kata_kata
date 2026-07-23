// ============================================================
// Type Definitions untuk KataKata Dashboard
// File ini dapat diimport di frontend JSX maupun backend TS
// ============================================================

// ---- User --------------------------------------------------

export interface UserType {
  id: number;
  name: string;
  email: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ---- Author ------------------------------------------------

export interface AuthorType {
  id: number;
  name: string;
  title?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  tags: string[];
  quotesCount: number;
  userId?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type CreateAuthorInput = {
  name: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
  tags?: string[];
  userId?: number | null;
};

export type UpdateAuthorInput = Partial<CreateAuthorInput>;

// ---- Category -----------------------------------------------

export interface CategoryType {
  id: number;
  name: string;
  colorBg: string;
  glowColor: string;
  quotesCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type CreateCategoryInput = Omit<CategoryType, "id" | "createdAt" | "updatedAt" | "quotesCount"> & {
  quotesCount?: number;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// ---- Quote --------------------------------------------------

export interface QuoteType {
  id: number;
  text: string;
  isFavorite: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relasi ke Author (nullable — join dari tabel authors)
  authorId?: number | null;
  author?: AuthorType | null;
  // Relasi ke Category (many-to-many)
  categories?: CategoryType[];
}

export type CreateQuoteInput = {
  text: string;
  isFavorite?: boolean;
  authorId?: number | null;
  categoryIds?: number[];
};

export type UpdateQuoteInput = Partial<CreateQuoteInput>;

// ---- API Response ------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
