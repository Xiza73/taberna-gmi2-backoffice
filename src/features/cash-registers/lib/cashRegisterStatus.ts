import type { CashRegisterStatus } from '@/types/cashRegisters';

export const CASH_REGISTER_STATUSES: CashRegisterStatus[] = ['open', 'closed'];

export const cashRegisterStatusLabels: Record<CashRegisterStatus, string> = {
  open: 'Abierta',
  closed: 'Cerrada',
};

export const cashRegisterStatusBadgeClass: Record<CashRegisterStatus, string> =
  {
    open: 'bg-emerald-500/10 text-emerald-400',
    closed: 'bg-muted text-muted-foreground',
  };
