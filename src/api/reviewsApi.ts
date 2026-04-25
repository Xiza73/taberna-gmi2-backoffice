import type { Paginated } from '@/types/api';
import type { Review, ReviewListQuery } from '@/types/reviews';
import { apiClient } from './client';

export const reviewsApi = {
  list(query: ReviewListQuery = {}): Promise<Paginated<Review>> {
    return apiClient.get<Paginated<Review>>('/admin/reviews', { query });
  },

  approve(id: string): Promise<Review> {
    return apiClient.post<Review>(`/admin/reviews/${id}/approve`);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/reviews/${id}`);
  },
};
