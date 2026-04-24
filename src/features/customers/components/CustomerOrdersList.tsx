import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { OrderStatusBadge, useOrders } from '@/features/orders';
import { formatDateTime, formatPEN } from '@/utils/format';

interface Props {
  customerId: string;
}

export function CustomerOrdersList({ customerId }: Props) {
  const ordersQuery = useOrders({ userId: customerId, page: 1, limit: 10 });
  const orders = ordersQuery.data?.items ?? [];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 lg:px-5 py-3 border-b border-border flex items-baseline justify-between">
        <h3 className="text-sm text-muted-foreground">Pedidos recientes</h3>
        {ordersQuery.data && (
          <span className="text-xs text-muted-foreground">
            {ordersQuery.data.total} en total
          </span>
        )}
      </div>

      {ordersQuery.isLoading ? (
        <div className="divide-y divide-border animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 px-4 flex items-center gap-4">
              <div className="h-3 w-1/4 bg-muted rounded" />
              <div className="h-3 w-1/6 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded ml-auto" />
            </div>
          ))}
        </div>
      ) : ordersQuery.isError ? (
        <div className="p-6">
          <p className="text-sm text-destructive">No se pudieron cargar los pedidos.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-6">
          <p className="text-sm text-muted-foreground">
            Este cliente no tiene pedidos todavía.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  <Link
                    to="/orders/$orderId"
                    params={{ orderId: order.id }}
                    className="hover:text-primary transition-colors"
                  >
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {formatDateTime(order.createdAt)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {formatPEN(order.total)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    to="/orders/$orderId"
                    params={{ orderId: order.id }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Ver detalle"
                  >
                    <ChevronRight size={16} className="inline" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
