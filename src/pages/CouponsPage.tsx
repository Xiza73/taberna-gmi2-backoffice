import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import {
  CouponFormModal,
  CouponsFilters,
  CouponsTable,
  useCoupons,
  useDeleteCoupon,
} from '@/features/coupons';
import { useDebounce } from '@/hooks/useDebounce';
import type { Coupon, CouponType } from '@/types/coupons';

const PAGE_SIZE = 20;

type TypeFilter = CouponType | '';
type StatusFilter = 'all' | 'active' | 'inactive';

export function CouponsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [type, setType] = useState<TypeFilter>('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | undefined>();
  const [deleting, setDeleting] = useState<Coupon | undefined>();

  const debouncedSearch = useDebounce(searchInput, 300);

  const isActiveFilter =
    status === 'active' ? true : status === 'inactive' ? false : undefined;

  const listQuery = useCoupons({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    type: type === '' ? undefined : type,
    isActive: isActiveFilter,
  });

  const deleteMutation = useDeleteCoupon();

  const onSearchChange = (v: string) => {
    setSearchInput(v);
    setPage(1);
  };
  const onTypeChange = (v: TypeFilter) => {
    setType(v);
    setPage(1);
  };
  const onStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(undefined);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const target = deleting;
    setDeleting(undefined);
    try {
      await deleteMutation.mutateAsync(target.id);
      toast.success(`Cupón "${target.code}" eliminado`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo eliminar';
      toast.error(message);
    }
  };

  const data = listQuery.data;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl lg:text-3xl mb-1">Cupones</h2>
            <p className="text-sm text-muted-foreground">
              Códigos de descuento que los clientes aplican en el checkout.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus size={16} />
            <span>Nuevo cupón</span>
          </Button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <CouponsFilters
            searchInput={searchInput}
            onSearchChange={onSearchChange}
            type={type}
            onTypeChange={onTypeChange}
            status={status}
            onStatusChange={onStatusChange}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {listQuery.isLoading ? (
            <CouponsTableSkeleton />
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar los cupones.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {listQuery.error instanceof Error
                  ? listQuery.error.message
                  : 'Error desconocido'}
              </p>
            </div>
          ) : data ? (
            <>
              <CouponsTable
                coupons={data.items}
                onEdit={openEdit}
                onDelete={setDeleting}
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

      <CouponFormModal
        isOpen={formOpen}
        onClose={closeForm}
        coupon={editing}
      />

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(undefined)}
        onConfirm={() => void confirmDelete()}
        title="Eliminar cupón"
        message={
          deleting
            ? `¿Eliminar el cupón "${deleting.code}"? Es una eliminación dura: las órdenes ya creadas conservan el snapshot del código pero ya no se podrá aplicar de nuevo.`
            : ''
        }
      />
    </div>
  );
}

function CouponsTableSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 px-4 flex items-center gap-4">
          <div className="h-3 w-1/6 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-12 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
