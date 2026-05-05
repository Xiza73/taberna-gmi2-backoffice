import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type {
  OrderChannel,
  OrderStatus,
  PaymentMethod,
} from '@/types/orders';
import { ORDER_STATUSES, orderStatusLabels } from '../lib/orderStatus';
import { PAYMENT_METHODS, paymentMethodLabels } from '../lib/paymentMethod';
import { ORDER_CHANNELS, channelLabels } from '../lib/channel';

type StatusFilter = OrderStatus | '';
type PaymentMethodFilter = PaymentMethod | '';
type ChannelFilter = OrderChannel | '';

interface Props {
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  paymentMethod: PaymentMethodFilter;
  onPaymentMethodChange: (value: PaymentMethodFilter) => void;
  channel: ChannelFilter;
  onChannelChange: (value: ChannelFilter) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
}

export function OrdersFilters({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  paymentMethod,
  onPaymentMethodChange,
  channel,
  onChannelChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: Props) {
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    ...ORDER_STATUSES.map((s) => ({ value: s, label: orderStatusLabels[s] })),
  ];

  const paymentMethodOptions = [
    { value: '', label: 'Todos los métodos' },
    ...PAYMENT_METHODS.map((m) => ({
      value: m,
      label: paymentMethodLabels[m],
    })),
  ];

  const channelOptions = [
    { value: '', label: 'Todos los canales' },
    ...ORDER_CHANNELS.map((c) => ({ value: c, label: channelLabels[c] })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
      <div className="relative lg:col-span-2">
        <Search
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Buscar por número"
          placeholder="ORD-..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        label="Estado"
        options={statusOptions}
        value={status}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
      />

      <Select
        label="Método de pago"
        options={paymentMethodOptions}
        value={paymentMethod}
        onChange={(e) =>
          onPaymentMethodChange(e.target.value as PaymentMethodFilter)
        }
      />

      <Select
        label="Canal"
        options={channelOptions}
        value={channel}
        onChange={(e) => onChannelChange(e.target.value as ChannelFilter)}
      />

      <div className="grid grid-cols-2 gap-2 lg:col-span-3">
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
    </div>
  );
}
