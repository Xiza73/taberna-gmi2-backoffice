import { useQuery } from '@tanstack/react-query';
import { shipmentsApi } from '@/api/shipmentsApi';
import { ApiError } from '@/api/errors';

export const shipmentKeys = {
  all: ['shipments'] as const,
  detail: (orderId: string) => [...shipmentKeys.all, 'detail', orderId] as const,
};

export function useShipment(orderId: string | undefined) {
  return useQuery({
    queryKey: shipmentKeys.detail(orderId ?? ''),
    queryFn: () => shipmentsApi.getByOrderId(orderId as string),
    enabled: Boolean(orderId),
    staleTime: 30_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.code === 'NOT_FOUND') return false;
      return failureCount < 1;
    },
  });
}
