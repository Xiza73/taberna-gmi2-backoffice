import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/ordersApi';
import { orderKeys } from './useOrders';

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ''),
    queryFn: () => ordersApi.getById(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
