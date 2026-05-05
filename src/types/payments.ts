export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded';

export interface Payment {
  id: string;
  orderId: string;
  externalId: string | null;
  preferenceId: string | null;
  method: string | null;
  status: PaymentStatus;
  amount: number;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}
