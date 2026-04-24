import type {
  CreateShipmentInput,
  Shipment,
  UpdateShipmentInput,
} from '@/types/shipments';
import { apiClient } from './client';

export const shipmentsApi = {
  getByOrderId(orderId: string): Promise<Shipment> {
    return apiClient.get<Shipment>(`/admin/orders/${orderId}/shipment`);
  },

  create(orderId: string, input: CreateShipmentInput): Promise<Shipment> {
    return apiClient.post<Shipment>(`/admin/orders/${orderId}/shipment`, input);
  },

  update(orderId: string, input: UpdateShipmentInput): Promise<Shipment> {
    return apiClient.patch<Shipment>(`/admin/orders/${orderId}/shipment`, input);
  },
};
