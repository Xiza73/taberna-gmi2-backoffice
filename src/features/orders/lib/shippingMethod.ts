import type { ShippingMethod } from '@/types/orders';

export const SHIPPING_METHODS: ShippingMethod[] = [
  'standard',
  'express',
  'pickup',
];

export const shippingMethodLabels: Record<ShippingMethod, string> = {
  standard: 'Estándar',
  express: 'Express',
  pickup: 'Retiro en tienda',
};
