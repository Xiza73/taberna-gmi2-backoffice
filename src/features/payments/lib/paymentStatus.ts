import type { PaymentStatus } from '@/types/payments';

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  refunded: 'Reembolsado',
};

export const paymentStatusBadgeClass: Record<PaymentStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  approved: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-destructive/10 text-destructive',
  refunded: 'bg-amber-500/10 text-amber-400',
};
