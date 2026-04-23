import { formatDateTime } from '@/utils/format';
import type { OrderEvent, OrderStatus } from '@/types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';

interface Props {
  events: OrderEvent[];
}

const VALID_STATUSES = new Set<OrderStatus>([
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]);

function isOrderStatus(value: string): value is OrderStatus {
  return VALID_STATUSES.has(value as OrderStatus);
}

export function OrderEventsTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 lg:p-5">
        <h3 className="text-sm text-muted-foreground mb-2">Historial</h3>
        <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>
      </div>
    );
  }

  const ordered = [...events].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5">
      <h3 className="text-sm text-muted-foreground mb-4">Historial</h3>
      <ol className="space-y-4 relative pl-5 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-px before:bg-border">
        {ordered.map((event) => (
          <li key={event.id} className="relative">
            <span className="absolute -left-[14px] top-1 w-2 h-2 rounded-full bg-primary ring-2 ring-card" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                {isOrderStatus(event.status) ? (
                  <OrderStatusBadge status={event.status} />
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {event.status}
                  </span>
                )}
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatDateTime(event.createdAt)}
                </span>
              </div>
              <p className="text-sm">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
