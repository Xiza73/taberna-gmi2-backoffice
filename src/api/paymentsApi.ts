import type { Payment } from '@/types/payments';
import { apiClient } from './client';

export const paymentsApi = {
  getByOrderId(orderId: string): Promise<Payment> {
    return apiClient.get<Payment>(`/admin/orders/${orderId}/payment`);
  },
};
