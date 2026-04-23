import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Pagination } from '@/components/ui/Pagination';
import {
  OrdersFilters,
  OrdersTable,
  useOrders,
} from '@/features/orders';
import { useDebounce } from '@/hooks/useDebounce';
import type { Order, OrderStatus } from '@/types/orders';

const PAGE_SIZE = 20;

type StatusFilter = OrderStatus | '';

export function OrdersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const debouncedSearch = useDebounce(searchInput, 300);

  const listQuery = useOrders({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    status: status === '' ? undefined : status,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const onSearchChange = (v: string) => {
    setSearchInput(v);
    setPage(1);
  };
  const onStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };
  const onDateFromChange = (v: string) => {
    setDateFrom(v);
    setPage(1);
  };
  const onDateToChange = (v: string) => {
    setDateTo(v);
    setPage(1);
  };

  const handleSelect = (order: Order) => {
    void navigate({ to: '/orders/$orderId', params: { orderId: order.id } });
  };

  const data = listQuery.data;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Pedidos</h2>
          <p className="text-sm text-muted-foreground">
            Listado y gestión de pedidos.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <OrdersFilters
            searchInput={searchInput}
            onSearchChange={onSearchChange}
            status={status}
            onStatusChange={onStatusChange}
            dateFrom={dateFrom}
            onDateFromChange={onDateFromChange}
            dateTo={dateTo}
            onDateToChange={onDateToChange}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {listQuery.isLoading ? (
            <OrdersTableSkeleton />
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar los pedidos.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {listQuery.error instanceof Error
                  ? listQuery.error.message
                  : 'Error desconocido'}
              </p>
            </div>
          ) : data ? (
            <>
              <OrdersTable orders={data.items} onSelect={handleSelect} />
              {data.totalPages > 1 && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  totalItems={data.total}
                  itemsPerPage={data.limit}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OrdersTableSkeleton() {
  return (
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
  );
}
