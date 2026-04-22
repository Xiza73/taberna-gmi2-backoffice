import type { Paginated } from '@/types/api';
import type {
  AdjustStockInput,
  CreateProductInput,
  Product,
  ProductListQuery,
  UpdateProductInput,
} from '@/types/products';
import { apiClient } from './client';

export const productsApi = {
  list(query: ProductListQuery = {}): Promise<Paginated<Product>> {
    return apiClient.get<Paginated<Product>>('/admin/products', { query });
  },

  getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/admin/products/${id}`);
  },

  create(input: CreateProductInput): Promise<Product> {
    return apiClient.post<Product>('/admin/products', input);
  },

  update(id: string, input: UpdateProductInput): Promise<Product> {
    return apiClient.patch<Product>(`/admin/products/${id}`, input);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/products/${id}`);
  },

  adjustStock(id: string, input: AdjustStockInput): Promise<Product> {
    return apiClient.patch<Product>(`/admin/products/${id}/stock`, input);
  },
};
