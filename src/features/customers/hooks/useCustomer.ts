import { useQuery } from '@tanstack/react-query';
import { customersApi } from '@/api/customersApi';
import { customerKeys } from './useCustomers';

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id ?? ''),
    queryFn: () => customersApi.getById(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
