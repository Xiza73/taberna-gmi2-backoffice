import type { PaymentMethod } from '@/types/orders';

export const PAYMENT_METHODS: PaymentMethod[] = [
  'mercadopago',
  'cash',
  'yape_plin',
  'bank_transfer',
];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  mercadopago: 'MercadoPago',
  cash: 'Efectivo',
  yape_plin: 'Yape / Plin',
  bank_transfer: 'Transferencia',
};

export const paymentMethodBadgeClass: Record<PaymentMethod, string> = {
  mercadopago: 'bg-cyan-500/10 text-cyan-400',
  cash: 'bg-emerald-500/10 text-emerald-400',
  yape_plin: 'bg-purple-500/10 text-purple-400',
  bank_transfer: 'bg-blue-500/10 text-blue-400',
};
