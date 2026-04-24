import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/ordersApi';
import type { OrderListQuery } from '@/types/orders';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (query: OrderListQuery) => [...orderKeys.lists(), query] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrders(query: OrderListQuery = {}) {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => ordersApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
