import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categoriesApi';
import type { CategoryListQuery } from '@/types/categories';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (query: CategoryListQuery) => [...categoryKeys.lists(), query] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export function useCategories(query: CategoryListQuery = {}) {
  return useQuery({
    queryKey: categoryKeys.list(query),
    queryFn: () => categoriesApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
