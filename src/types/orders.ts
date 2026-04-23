export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface ShippingAddressSnapshot {
  street?: string;
  district?: string;
  city?: string;
  department?: string;
  zipCode?: string;
  recipientName?: string;
  phone?: string;
  reference?: string | null;
  [key: string]: unknown;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderEvent {
  id: string;
  status: string;
  description: string;
  performedBy: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponId: string | null;
  couponCode: string | null;
  couponDiscount: number | null;
  shippingAddressSnapshot: ShippingAddressSnapshot;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  events?: OrderEvent[];
  paymentUrl?: string | null;
}

export interface OrderListQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
}
