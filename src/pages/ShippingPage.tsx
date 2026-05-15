import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronRight, ExternalLink, Search } from 'lucide-react';
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
import { OrderStatusBadge, useOrders } from '@/features/orders';
import { useDebounce } from '@/hooks/useDebounce';
import { parseEnum } from '@/utils/parseEnum';
import { formatDateTime } from '@/utils/format';
import type { Order, OrderStatus } from '@/types/orders';

const PAGE_SIZE = 20;

const SHIPPABLE_STATUSES: OrderStatus[] = [
  'paid',
  'processing',
  'shipped',
  'delivered',
];

type StatusFilter = 'all' | OrderStatus;

const STATUS_FILTER_VALUES = [
  'all',
  'paid',
  'processing',
  'shipped',
  'delivered',
] as const satisfies readonly StatusFilter[];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos los enviables' },
  { value: 'paid', label: 'Pagada — pendiente de envío' },
  { value: 'processing', label: 'En preparación' },
  { value: 'shipped', label: 'Enviada' },
  { value: 'delivered', label: 'Entregada' },
];

export function ShippingPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const debouncedSearch = useDebounce(searchInput, 300);

  const listQuery = useOrders({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const data = listQuery.data;

  const visibleItems =
    data && statusFilter === 'all'
      ? data.items.filter((o) => SHIPPABLE_STATUSES.includes(o.status))
      : (data?.items ?? []);

  const handleSelect = (order: Order) => {
    void navigate({ to: '/orders/$orderId', params: { orderId: order.id } });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Envíos</h2>
          <p className="text-sm text-muted-foreground">
            Pedidos pagados que requieren envío. Hacé click para registrar
            tracking.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  parseEnum(e.currentTarget.value, STATUS_FILTER_VALUES, 'all'),
                );
                setPage(1);
              }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
                No se pudieron cargar los envíos.
              </p>
            </div>
          ) : visibleItems.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº pedido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleItems.map((order) => (
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
                            {order.customerPhone ?? order.customerEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ShippingDestination order={order} />
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
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
              {data && data.total > 0 && (
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
                No hay envíos pendientes.
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ExternalLink size={12} />
          El registro de carrier y tracking se hace en el detalle del pedido.
        </p>
      </div>
    </div>
  );
}

function ShippingDestination({ order }: { order: Order }) {
  const snap = order.shippingAddressSnapshot;
  if (!snap) {
    return (
      <span className="text-xs text-muted-foreground italic">Sin dirección</span>
    );
  }
  const city = (snap.city ?? snap.district ?? '') as string;
  const dept = (snap.department ?? '') as string;
  return (
    <div className="flex flex-col">
      <span className="text-sm">{city || '—'}</span>
      {dept && (
        <span className="text-xs text-muted-foreground">{dept}</span>
      )}
    </div>
  );
}
