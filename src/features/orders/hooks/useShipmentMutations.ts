import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shipmentsApi } from '@/api/shipmentsApi';
import type {
  CreateShipmentInput,
  UpdateShipmentInput,
} from '@/types/shipments';
import { orderKeys } from './useOrders';
import { shipmentKeys } from './useShipment';

function invalidateOrderAndShipment(
  qc: ReturnType<typeof useQueryClient>,
  orderId: string,
) {
  void qc.invalidateQueries({ queryKey: shipmentKeys.detail(orderId) });
  void qc.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
  void qc.invalidateQueries({ queryKey: orderKeys.lists() });
}

export function useCreateShipment(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateShipmentInput) =>
      shipmentsApi.create(orderId, input),
    onSuccess: () => invalidateOrderAndShipment(qc, orderId),
  });
}

export function useUpdateShipment(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateShipmentInput) =>
      shipmentsApi.update(orderId, input),
    onSuccess: () => invalidateOrderAndShipment(qc, orderId),
  });
}
