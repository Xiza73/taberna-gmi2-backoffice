import type { Paginated } from '@/types/api';
import type {
  CashRegister,
  CashRegisterListQuery,
} from '@/types/cashRegisters';
import { apiClient } from './client';

export const cashRegistersApi = {
  list(query: CashRegisterListQuery = {}): Promise<Paginated<CashRegister>> {
    return apiClient.get<Paginated<CashRegister>>('/admin/pos/cash-register', {
      query,
    });
  },

  getById(id: string): Promise<CashRegister> {
    return apiClient.get<CashRegister>(`/admin/pos/cash-register/${id}`);
  },
};
