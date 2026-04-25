import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviewsApi';
import type { ReviewListQuery } from '@/types/reviews';

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (query: ReviewListQuery) => [...reviewKeys.lists(), query] as const,
};

export function useReviews(query: ReviewListQuery = {}) {
  return useQuery({
    queryKey: reviewKeys.list(query),
    queryFn: () => reviewsApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
