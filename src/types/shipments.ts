export type Carrier = 'shalom' | 'serpost' | 'olva' | 'dhl' | 'other';

export type ShipmentStatus = 'shipped' | 'in_transit' | 'delivered';

export interface Shipment {
  id: string;
  orderId: string;
  carrier: Carrier;
  trackingNumber: string;
  trackingUrl: string;
  status: ShipmentStatus;
  shippedAt: string | null;
  deliveredAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShipmentInput {
  carrier: Carrier;
  trackingNumber: string;
  trackingUrl?: string;
  notes?: string;
}

export interface UpdateShipmentInput {
  carrier?: Carrier;
  trackingNumber?: string;
  trackingUrl?: string;
  status?: ShipmentStatus;
  notes?: string;
}
