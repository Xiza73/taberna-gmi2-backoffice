import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/api/paymentsApi';
import { ApiError } from '@/api/errors';

export const paymentKeys = {
  all: ['payments'] as const,
  detail: (orderId: string) => [...paymentKeys.all, 'detail', orderId] as const,
};

export function usePayment(orderId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.detail(orderId ?? ''),
    queryFn: () => paymentsApi.getByOrderId(orderId as string),
    enabled: Boolean(orderId),
    staleTime: 30_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.code === 'NOT_FOUND') return false;
      return failureCount < 1;
    },
  });
}
