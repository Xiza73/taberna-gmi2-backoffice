import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/productsApi';
import type { ProductListQuery } from '@/types/products';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (query: ProductListQuery) => [...productKeys.lists(), query] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts(query: ProductListQuery = {}) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productsApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
