import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { customersApi } from '@/api/customersApi';
import type { CustomerListQuery } from '@/types/customers';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (query: CustomerListQuery) => [...customerKeys.lists(), query] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

export function useCustomers(query: CustomerListQuery = {}) {
  return useQuery({
    queryKey: customerKeys.list(query),
    queryFn: () => customersApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
