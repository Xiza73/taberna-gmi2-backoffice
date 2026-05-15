import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { cashRegistersApi } from '@/api/cashRegistersApi';
import type { CashRegisterListQuery } from '@/types/cashRegisters';

export const cashRegisterKeys = {
  all: ['cash-registers'] as const,
  lists: () => [...cashRegisterKeys.all, 'list'] as const,
  list: (query: CashRegisterListQuery) =>
    [...cashRegisterKeys.lists(), query] as const,
  details: () => [...cashRegisterKeys.all, 'detail'] as const,
  detail: (id: string) => [...cashRegisterKeys.details(), id] as const,
};

export function useCashRegisters(query: CashRegisterListQuery = {}) {
  return useQuery({
    queryKey: cashRegisterKeys.list(query),
    queryFn: () => cashRegistersApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
