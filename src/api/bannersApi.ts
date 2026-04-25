import type { Paginated } from '@/types/api';
import type {
  Banner,
  BannerListQuery,
  CreateBannerInput,
  UpdateBannerInput,
} from '@/types/banners';
import { apiClient } from './client';

export const bannersApi = {
  list(query: BannerListQuery = {}): Promise<Paginated<Banner>> {
    return apiClient.get<Paginated<Banner>>('/admin/banners', { query });
  },

  getById(id: string): Promise<Banner> {
    return apiClient.get<Banner>(`/admin/banners/${id}`);
  },

  create(input: CreateBannerInput): Promise<Banner> {
    return apiClient.post<Banner>('/admin/banners', input);
  },

  update(id: string, input: UpdateBannerInput): Promise<Banner> {
    return apiClient.patch<Banner>(`/admin/banners/${id}`, input);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/banners/${id}`);
  },
};
