import { ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { formatDateTime, formatPEN } from '@/utils/format';
import type { Order } from '@/types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export function OrdersTable({ orders, onSelect }: Props) {
  if (orders.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No hay pedidos para mostrar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nº</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="w-[40px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            onClick={() => onSelect(order)}
            className="cursor-pointer"
          >
            <TableCell className="font-mono text-xs">{order.orderNumber}</TableCell>
            <TableCell className="text-sm text-muted-foreground tabular-nums">
              {formatDateTime(order.createdAt)}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>{order.customerName}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {order.customerEmail}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-right tabular-nums font-medium">
              {formatPEN(order.total)}
            </TableCell>
            <TableCell className="text-right">
              <ChevronRight size={16} className="text-muted-foreground inline" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
