import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  OrderCustomerCard,
  OrderEventsTimeline,
  OrderItemsList,
  OrderNotesCard,
  OrderStatusBadge,
  OrderTotalsCard,
  useOrder,
} from '@/features/orders';
import { formatDateTime } from '@/utils/format';

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ strict: false }) as { orderId?: string };
  const orderQuery = useOrder(orderId);

  const goBack = () => {
    void navigate({ to: '/orders' });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6 flex items-start gap-3">
          <button
            type="button"
            onClick={goBack}
            className="mt-1 p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl lg:text-3xl truncate">
                {orderQuery.data ? (
                  <span className="font-mono">{orderQuery.data.orderNumber}</span>
                ) : (
                  'Pedido'
                )}
              </h2>
              {orderQuery.data && (
                <OrderStatusBadge status={orderQuery.data.status} />
              )}
            </div>
            {orderQuery.data && (
              <p className="text-sm text-muted-foreground mt-1">
                Creado el {formatDateTime(orderQuery.data.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {orderQuery.isLoading ? (
          <OrderDetailSkeleton />
        ) : orderQuery.isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-sm text-destructive">No se pudo cargar el pedido.</p>
            <p className="text-xs text-muted-foreground mt-1">
              {orderQuery.error instanceof Error
                ? orderQuery.error.message
                : 'Error desconocido'}
            </p>
          </div>
        ) : orderQuery.data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <OrderItemsList items={orderQuery.data.items ?? []} />
              <OrderEventsTimeline events={orderQuery.data.events ?? []} />
            </div>
            <aside className="space-y-4">
              <OrderTotalsCard order={orderQuery.data} />
              <OrderCustomerCard order={orderQuery.data} />
              <OrderNotesCard order={orderQuery.data} />
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-64 rounded-lg border border-border bg-card/50" />
        <div className="h-48 rounded-lg border border-border bg-card/50" />
      </div>
      <aside className="space-y-4">
        <div className="h-40 rounded-lg border border-border bg-card/50" />
        <div className="h-40 rounded-lg border border-border bg-card/50" />
      </aside>
    </div>
  );
}
