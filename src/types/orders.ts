export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type OrderChannel = 'online' | 'pos' | 'whatsapp';

export type PaymentMethod =
  | 'mercadopago'
  | 'cash'
  | 'yape_plin'
  | 'bank_transfer';

export type ShippingMethod = 'standard' | 'express' | 'pickup';

export type CustomerDocType = 'dni' | 'ruc';

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
  /**
   * Cliente de online checkout. Null para órdenes POS/WhatsApp donde
   * `staffId` es quien registró la venta. El back garantiza XOR vía
   * CHECK constraint (uno y solo uno está populado).
   */
  userId: string | null;
  /** Staff que registró la venta (POS/WhatsApp). Null para online. */
  staffId: string | null;
  /**
   * Nombre del staff resuelto por el back (join contra staff_members
   * en los endpoints `/admin/orders`). Null para online o cuando
   * staffId no se pudo resolver.
   */
  staffName: string | null;
  channel: OrderChannel;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponId: string | null;
  couponCode: string | null;
  couponDiscount: number | null;
  shippingAddressSnapshot: ShippingAddressSnapshot | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerDocType: CustomerDocType | null;
  customerDocNumber: string | null;
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
  paymentMethod?: PaymentMethod;
  channel?: OrderChannel;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface UpdateOrderNotesInput {
  adminNotes: string;
}
