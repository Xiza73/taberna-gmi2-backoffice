import type { OrderStatus } from '@/types/orders';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagada',
  processing: 'Procesando',
  shipped: 'Enviada',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
  refunded: 'Reembolsada',
};

export const orderStatusBadgeClass: Record<OrderStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  paid: 'bg-primary/10 text-primary',
  processing: 'bg-primary/20 text-primary',
  shipped: 'bg-cyan-500/10 text-cyan-400',
  delivered: 'bg-emerald-500/10 text-emerald-400',
  cancelled: 'bg-destructive/10 text-destructive',
  refunded: 'bg-amber-500/10 text-amber-400',
};

export const orderStatusChartColor: Record<OrderStatus, string> = {
  pending: '#a1a1aa',
  paid: '#6366f1',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
  refunded: '#f59e0b',
};
