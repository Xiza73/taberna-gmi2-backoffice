import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import type { RecentOrder } from '@/types/dashboard';
import { formatDateTime, formatPEN } from '@/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';

interface Props {
  orders: RecentOrder[];
}

export function RecentOrdersTable({ orders }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5">
      <h3 className="text-sm text-muted-foreground mb-4">Pedidos recientes</h3>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No hay pedidos todavía.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPEN(order.total)}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                  {formatDateTime(order.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
