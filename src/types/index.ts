// ============================================================
// Type Definitions untuk KataKata Dashboard
// File ini dapat diimport di frontend JSX maupun backend TS
// ============================================================

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
  author: string;
  role?: string | null;
  isFavorite: boolean;
  avatarGradient?: string | null;
  avatarInitials?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  categories?: CategoryType[];
}

export type CreateQuoteInput = Omit<QuoteType, "id" | "createdAt" | "updatedAt" | "categories"> & {
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
