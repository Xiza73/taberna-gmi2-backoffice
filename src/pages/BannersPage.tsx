import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import {
  BannerFormModal,
  BannersFilters,
  BannersTable,
  useBanners,
  useDeleteBanner,
} from '@/features/banners';
import { useDebounce } from '@/hooks/useDebounce';
import type { Banner, BannerPosition } from '@/types/banners';

const PAGE_SIZE = 20;

type PositionFilter = BannerPosition | '';
type StatusFilter = 'all' | 'active' | 'inactive';

export function BannersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [position, setPosition] = useState<PositionFilter>('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | undefined>();
  const [deleting, setDeleting] = useState<Banner | undefined>();

  const debouncedSearch = useDebounce(searchInput, 300);

  const isActiveFilter =
    status === 'active' ? true : status === 'inactive' ? false : undefined;

  const listQuery = useBanners({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    position: position === '' ? undefined : position,
    isActive: isActiveFilter,
  });

  const deleteMutation = useDeleteBanner();

  const onSearchChange = (v: string) => {
    setSearchInput(v);
    setPage(1);
  };
  const onPositionChange = (v: PositionFilter) => {
    setPosition(v);
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

  const openEdit = (banner: Banner) => {
    setEditing(banner);
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
      toast.success(`Banner "${target.title}" eliminado`);
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
            <h2 className="text-2xl lg:text-3xl mb-1">Banners</h2>
            <p className="text-sm text-muted-foreground">
              Imágenes promocionales que aparecen en el storefront por posición.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus size={16} />
            <span>Nuevo banner</span>
          </Button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <BannersFilters
            searchInput={searchInput}
            onSearchChange={onSearchChange}
            position={position}
            onPositionChange={onPositionChange}
            status={status}
            onStatusChange={onStatusChange}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {listQuery.isLoading ? (
            <BannersTableSkeleton />
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar los banners.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {listQuery.error instanceof Error
                  ? listQuery.error.message
                  : 'Error desconocido'}
              </p>
            </div>
          ) : data ? (
            <>
              <BannersTable
                banners={data.items}
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

      <BannerFormModal
        isOpen={formOpen}
        onClose={closeForm}
        banner={editing}
      />

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(undefined)}
        onConfirm={() => void confirmDelete()}
        title="Eliminar banner"
        message={
          deleting
            ? `¿Eliminar el banner "${deleting.title}"? La imagen queda en Cloudinary y se puede limpiar manualmente desde su panel.`
            : ''
        }
      />
    </div>
  );
}

function BannersTableSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 px-4 flex items-center gap-4">
          <div className="w-24 h-12 rounded bg-muted" />
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
