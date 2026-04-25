import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviewsApi';
import { reviewKeys } from './useReviews';

export function useApproveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.approve(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
}
