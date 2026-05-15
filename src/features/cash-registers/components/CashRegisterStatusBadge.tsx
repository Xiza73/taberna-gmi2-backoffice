import type { CashRegisterStatus } from '@/types/cashRegisters';
import { cn } from '@/utils/cn';
import {
  cashRegisterStatusBadgeClass,
  cashRegisterStatusLabels,
} from '../lib/cashRegisterStatus';

interface Props {
  status: CashRegisterStatus;
  className?: string;
}

export function CashRegisterStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs px-2 py-0.5 rounded',
        cashRegisterStatusBadgeClass[status],
        className,
      )}
    >
      {cashRegisterStatusLabels[status]}
    </span>
  );
}
