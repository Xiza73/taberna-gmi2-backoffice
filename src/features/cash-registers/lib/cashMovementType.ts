import type { CashMovementType } from '@/types/cashRegisters';

export const CASH_MOVEMENT_TYPES: CashMovementType[] = ['cash_in', 'cash_out'];

export const cashMovementTypeLabels: Record<CashMovementType, string> = {
  cash_in: 'Ingreso',
  cash_out: 'Egreso',
};

export const cashMovementTypeBadgeClass: Record<CashMovementType, string> = {
  cash_in: 'bg-emerald-500/10 text-emerald-400',
  cash_out: 'bg-destructive/10 text-destructive',
};

/** Signo aplicado al monto al mostrarlo en pantalla. */
export const cashMovementSign: Record<CashMovementType, 1 | -1> = {
  cash_in: 1,
  cash_out: -1,
};
