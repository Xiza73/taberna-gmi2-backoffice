import type { Paginated } from '@/types/api';
import type {
  Customer,
  CustomerListQuery,
  UpdateCustomerInput,
} from '@/types/customers';
import { apiClient } from './client';

export const customersApi = {
  list(query: CustomerListQuery = {}): Promise<Paginated<Customer>> {
    return apiClient.get<Paginated<Customer>>('/admin/customers', { query });
  },

  getById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`/admin/customers/${id}`);
  },

  update(id: string, input: UpdateCustomerInput): Promise<Customer> {
    return apiClient.patch<Customer>(`/admin/customers/${id}`, input);
  },

  suspend(id: string): Promise<Customer> {
    return apiClient.post<Customer>(`/admin/customers/${id}/suspend`);
  },

  activate(id: string): Promise<Customer> {
    return apiClient.post<Customer>(`/admin/customers/${id}/activate`);
  },
};
