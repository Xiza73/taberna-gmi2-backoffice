import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/productsApi';
import { productKeys } from './useProducts';

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => productsApi.getById(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
