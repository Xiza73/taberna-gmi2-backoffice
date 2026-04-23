import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/api/ordersApi';
import type {
  UpdateOrderNotesInput,
  UpdateOrderStatusInput,
} from '@/types/orders';
import { orderKeys } from './useOrders';

export function useUpdateOrderStatus(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateOrderStatusInput) =>
      ordersApi.updateStatus(orderId, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      void qc.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useUpdateOrderNotes(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateOrderNotesInput) =>
      ordersApi.updateNotes(orderId, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
  });
}
