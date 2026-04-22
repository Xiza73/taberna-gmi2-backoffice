import type { OrderStatus } from '@/types/dashboard';
import { cn } from '@/utils/cn';
import { orderStatusBadgeClass, orderStatusLabels } from '../lib/orderStatus';

interface Props {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs px-2 py-0.5 rounded',
        orderStatusBadgeClass[status],
      )}
    >
      {orderStatusLabels[status]}
    </span>
  );
}
