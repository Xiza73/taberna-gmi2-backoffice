import type { Paginated } from '@/types/api';
import type {
  Order,
  OrderListQuery,
  UpdateOrderNotesInput,
  UpdateOrderStatusInput,
} from '@/types/orders';
import { apiClient } from './client';

export const ordersApi = {
  list(query: OrderListQuery = {}): Promise<Paginated<Order>> {
    return apiClient.get<Paginated<Order>>('/admin/orders', { query });
  },

  getById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/admin/orders/${id}`);
  },

  updateStatus(id: string, input: UpdateOrderStatusInput): Promise<Order> {
    return apiClient.patch<Order>(`/admin/orders/${id}/status`, input);
  },

  updateNotes(id: string, input: UpdateOrderNotesInput): Promise<Order> {
    return apiClient.patch<Order>(`/admin/orders/${id}/notes`, input);
  },
};
