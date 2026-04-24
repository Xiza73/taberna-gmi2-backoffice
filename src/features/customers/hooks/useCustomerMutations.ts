import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '@/api/customersApi';
import type { UpdateCustomerInput } from '@/types/customers';
import { customerKeys } from './useCustomers';

function invalidateCustomer(
  qc: ReturnType<typeof useQueryClient>,
  id?: string,
) {
  void qc.invalidateQueries({ queryKey: customerKeys.lists() });
  if (id) {
    void qc.invalidateQueries({ queryKey: customerKeys.detail(id) });
  }
}

export function useUpdateCustomer(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCustomerInput) => customersApi.update(id, input),
    onSuccess: () => invalidateCustomer(qc, id),
  });
}

export function useSuspendCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customersApi.suspend(id),
    onSuccess: (_data, id) => invalidateCustomer(qc, id),
  });
}

export function useActivateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customersApi.activate(id),
    onSuccess: (_data, id) => invalidateCustomer(qc, id),
  });
}
