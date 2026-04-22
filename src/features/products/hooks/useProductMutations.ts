import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/productsApi';
import { productKeys } from './useProducts';

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
