import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  ORDER_STATUSES,
  OrderStatusBadge,
  PAYMENT_METHODS,
  orderStatusLabels,
  paymentMethodBadgeClass,
  paymentMethodLabels,
  useOrders,
} from '@/features/orders';
import { useDebounce } from '@/hooks/useDebounce';
import { parseEnum } from '@/utils/parseEnum';
import { formatDateTime, formatPEN } from '@/utils/format';
import type {
  Order,
  OrderStatus,
  PaymentMethod,
} from '@/types/orders';

const PAGE_SIZE = 20;

type StatusFilter = OrderStatus | '';
type MethodFilter = PaymentMethod | '';

const STATUS_VALUES = ['', ...ORDER_STATUSES] as const;
const METHOD_VALUES = ['', ...PAYMENT_METHODS] as const;

export function PaymentsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [paymentMethod, setPaymentMethod] = useState<MethodFilter>('');

  const debouncedSearch = useDebounce(searchInput, 300);

  const listQuery = useOrders({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    status: status === '' ? undefined : status,
    paymentMethod: paymentMethod === '' ? undefined : paymentMethod,
  });

  const data = listQuery.data;

  const handleSelect = (order: Order) => {
    void navigate({ to: '/orders/$orderId', params: { orderId: order.id } });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Pagos</h2>
          <p className="text-sm text-muted-foreground">
            Historial de pagos por pedido. Filtrá por método o estado.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                placeholder="Buscar por nº o cliente"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(
                  parseEnum(e.currentTarget.value, METHOD_VALUES, ''),
                );
                setPage(1);
              }}
            >
              <option value="">Todos los métodos</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {paymentMethodLabels[m]}
                </option>
              ))}
            </select>

            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(e) => {
                setStatus(parseEnum(e.currentTarget.value, STATUS_VALUES, ''));
                setPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {orderStatusLabels[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {listQuery.isLoading ? (
            <div className="divide-y divide-border animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 px-4 flex items-center gap-4">
                  <div className="h-3 w-1/6 bg-muted rounded" />
                  <div className="h-3 w-1/6 bg-muted rounded" />
                  <div className="h-3 w-1/4 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded ml-auto" />
                </div>
              ))}
            </div>
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar los pagos.
              </p>
            </div>
          ) : data && data.items.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº pedido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((order) => (
                    <TableRow
                      key={order.id}
                      onClick={() => handleSelect(order)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-mono text-xs">
                        {order.orderNumber}
                      </TableCell>
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
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${paymentMethodBadgeClass[order.paymentMethod]}`}
                        >
                          {paymentMethodLabels[order.paymentMethod]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatPEN(order.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <ChevronRight
                          size={16}
                          className="text-muted-foreground inline"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data.total > 0 && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  totalItems={data.total}
                  itemsPerPage={data.limit}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <div className="border-t border-border py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No hay pagos para mostrar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
