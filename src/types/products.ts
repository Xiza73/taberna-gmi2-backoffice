export type ProductSortBy = 'price' | 'price_desc' | 'name' | 'newest' | 'rating';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  stock: number;
  images: string[];
  categoryId: string;
  isActive: boolean;
  averageRating: number | null;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: ProductSortBy;
  includeInactive?: boolean;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  sku?: string | null;
  stock?: number;
  images?: string[];
  categoryId: string;
  isActive?: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface AdjustStockInput {
  delta: number;
  reason?: string;
}
