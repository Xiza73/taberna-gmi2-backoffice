import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { couponsApi } from '@/api/couponsApi';
import type { CouponListQuery } from '@/types/coupons';

export const couponKeys = {
  all: ['coupons'] as const,
  lists: () => [...couponKeys.all, 'list'] as const,
  list: (query: CouponListQuery) => [...couponKeys.lists(), query] as const,
  details: () => [...couponKeys.all, 'detail'] as const,
  detail: (id: string) => [...couponKeys.details(), id] as const,
};

export function useCoupons(query: CouponListQuery = {}) {
  return useQuery({
    queryKey: couponKeys.list(query),
    queryFn: () => couponsApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
