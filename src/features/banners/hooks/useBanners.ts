import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { bannersApi } from '@/api/bannersApi';
import type { BannerListQuery } from '@/types/banners';

export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: (query: BannerListQuery) => [...bannerKeys.lists(), query] as const,
  details: () => [...bannerKeys.all, 'detail'] as const,
  detail: (id: string) => [...bannerKeys.details(), id] as const,
};

export function useBanners(query: BannerListQuery = {}) {
  return useQuery({
    queryKey: bannerKeys.list(query),
    queryFn: () => bannersApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
