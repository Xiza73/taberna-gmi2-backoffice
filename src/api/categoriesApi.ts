import type { Paginated } from '@/types/api';
import type {
  Category,
  CategoryListQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/categories';
import { apiClient } from './client';

export const categoriesApi = {
  list(query: CategoryListQuery = {}): Promise<Paginated<Category>> {
    return apiClient.get<Paginated<Category>>('/admin/categories', { query });
  },

  getById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/admin/categories/${id}`);
  },

  create(input: CreateCategoryInput): Promise<Category> {
    return apiClient.post<Category>('/admin/categories', input);
  },

  update(id: string, input: UpdateCategoryInput): Promise<Category> {
    return apiClient.patch<Category>(`/admin/categories/${id}`, input);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/categories/${id}`);
  },
};
