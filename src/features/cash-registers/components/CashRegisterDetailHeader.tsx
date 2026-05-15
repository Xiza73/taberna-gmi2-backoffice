import { Clock, User } from 'lucide-react';
import { formatDateTime, formatPEN } from '@/utils/format';
import type { CashRegister } from '@/types/cashRegisters';
import { CashRegisterStatusBadge } from './CashRegisterStatusBadge';

interface Props {
  register: CashRegister;
}

export function CashRegisterDetailHeader({ register }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <CashRegisterStatusBadge status={register.status} />
        <span className="text-xs text-muted-foreground font-mono">
          ID: {register.id}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <Field
          icon={<Clock size={14} />}
          label="Apertura"
          value={formatDateTime(register.openedAt)}
        />
        <Field
          icon={<Clock size={14} />}
          label="Cierre"
          value={register.closedAt ? formatDateTime(register.closedAt) : '—'}
        />
        <Field
          icon={<User size={14} />}
          label="Staff"
          value={register.staffName ?? 'Sin nombre'}
        />
      </div>

      {register.status === 'closed' && register.closingAmount !== null && (
        <div className="pt-3 border-t border-border flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Total contado</span>
          <span className="text-2xl tabular-nums">
            {formatPEN(register.closingAmount)}
          </span>
        </div>
      )}
    </div>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="tabular-nums">{value}</p>
    </div>
  );
}
