import type { Paginated } from '@/types/api';
import type {
  Coupon,
  CouponListQuery,
  CreateCouponInput,
  UpdateCouponInput,
} from '@/types/coupons';
import { apiClient } from './client';

export const couponsApi = {
  list(query: CouponListQuery = {}): Promise<Paginated<Coupon>> {
    return apiClient.get<Paginated<Coupon>>('/admin/coupons', { query });
  },

  getById(id: string): Promise<Coupon> {
    return apiClient.get<Coupon>(`/admin/coupons/${id}`);
  },

  create(input: CreateCouponInput): Promise<Coupon> {
    return apiClient.post<Coupon>('/admin/coupons', input);
  },

  update(id: string, input: UpdateCouponInput): Promise<Coupon> {
    return apiClient.patch<Coupon>(`/admin/coupons/${id}`, input);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/coupons/${id}`);
  },
};
