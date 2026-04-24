import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import {
  CustomersFilters,
  CustomersTable,
  useActivateCustomer,
  useCustomers,
  useSuspendCustomer,
} from '@/features/customers';
import { useDebounce } from '@/hooks/useDebounce';
import type { Customer } from '@/types/customers';

const PAGE_SIZE = 20;

type StatusFilter = 'all' | 'active' | 'inactive';

export function CustomersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [togglingActive, setTogglingActive] = useState<Customer | undefined>();

  const debouncedSearch = useDebounce(searchInput, 300);

  const isActiveFilter =
    status === 'active' ? true : status === 'inactive' ? false : undefined;

  const listQuery = useCustomers({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    isActive: isActiveFilter,
  });

  const suspendMutation = useSuspendCustomer();
  const activateMutation = useActivateCustomer();

  const onSearchChange = (v: string) => {
    setSearchInput(v);
    setPage(1);
  };
  const onStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };

  const handleSelect = (customer: Customer) => {
    void navigate({
      to: '/customers/$customerId',
      params: { customerId: customer.id },
    });
  };

  const confirmToggleActive = async () => {
    if (!togglingActive) return;
    const target = togglingActive;
    setTogglingActive(undefined);
    try {
      if (target.isActive) {
        await suspendMutation.mutateAsync(target.id);
        toast.success(`${target.name} suspendido`);
      } else {
        await activateMutation.mutateAsync(target.id);
        toast.success(`${target.name} activado`);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo cambiar el estado';
      toast.error(message);
    }
  };

  const data = listQuery.data;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Clientes</h2>
          <p className="text-sm text-muted-foreground">
            Clientes del ecommerce. Los clientes se auto-registran; el staff los
            visualiza, edita información de contacto y puede suspenderlos.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <CustomersFilters
            searchInput={searchInput}
            onSearchChange={onSearchChange}
            status={status}
            onStatusChange={onStatusChange}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {listQuery.isLoading ? (
            <CustomersTableSkeleton />
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar los clientes.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {listQuery.error instanceof Error
                  ? listQuery.error.message
                  : 'Error desconocido'}
              </p>
            </div>
          ) : data ? (
            <>
              <CustomersTable
                customers={data.items}
                onSelect={handleSelect}
                onToggleActive={setTogglingActive}
              />
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
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(togglingActive)}
        onClose={() => setTogglingActive(undefined)}
        onConfirm={() => void confirmToggleActive()}
        title={togglingActive?.isActive ? 'Suspender cliente' : 'Activar cliente'}
        message={
          togglingActive
            ? togglingActive.isActive
              ? `¿Suspender a ${togglingActive.name}? No podrá iniciar sesión ni hacer compras hasta que lo actives de nuevo.`
              : `¿Activar a ${togglingActive.name}? Va a poder iniciar sesión inmediatamente.`
            : ''
        }
        confirmLabel={togglingActive?.isActive ? 'Suspender' : 'Activar'}
        variant={togglingActive?.isActive ? 'destructive' : 'primary'}
      />
    </div>
  );
}

function CustomersTableSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 px-4 flex items-center gap-4">
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-1/6 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
