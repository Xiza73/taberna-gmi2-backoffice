import { useQuery } from '@tanstack/react-query';
import { cashRegistersApi } from '@/api/cashRegistersApi';
import { cashRegisterKeys } from './useCashRegisters';

export function useCashRegister(id: string | undefined) {
  return useQuery({
    queryKey: cashRegisterKeys.detail(id ?? ''),
    queryFn: () => cashRegistersApi.getById(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
