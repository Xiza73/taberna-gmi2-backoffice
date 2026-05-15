import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { CashRegisterStatus } from '@/types/cashRegisters';
import {
  CASH_REGISTER_STATUSES,
  cashRegisterStatusLabels,
} from '../lib/cashRegisterStatus';

type StatusFilter = CashRegisterStatus | '';

interface Props {
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
}

export function CashRegistersFilters({
  status,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: Props) {
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    ...CASH_REGISTER_STATUSES.map((s) => ({
      value: s,
      label: cashRegisterStatusLabels[s],
    })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
      <Select
        label="Estado"
        options={statusOptions}
        value={status}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
      />

      <Input
        label="Desde"
        type="date"
        min="2020-01-01"
        max="2040-12-31"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
      />

      <Input
        label="Hasta"
        type="date"
        min="2020-01-01"
        max="2040-12-31"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
      />
    </div>
  );
}
