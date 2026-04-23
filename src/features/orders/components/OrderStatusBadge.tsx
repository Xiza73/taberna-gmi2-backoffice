import type { OrderStatus } from '@/types/orders';
import { cn } from '@/utils/cn';
import { orderStatusBadgeClass, orderStatusLabels } from '../lib/orderStatus';

interface Props {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs px-2 py-0.5 rounded',
        orderStatusBadgeClass[status],
        className,
      )}
    >
      {orderStatusLabels[status]}
    </span>
  );
}
