import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  CategoriesTable,
  CategoryFormModal,
  useCategories,
  useDeleteCategory,
} from '@/features/categories';
import type { Category } from '@/types/categories';

const PAGE_SIZE = 20;

export function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [includeInactive, setIncludeInactive] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [deleting, setDeleting] = useState<Category | undefined>();

  const listQuery = useCategories({
    page,
    limit: PAGE_SIZE,
    includeInactive,
  });

  const allForParents = useCategories({ page: 1, limit: 50, includeInactive: true });

  const deleteMutation = useDeleteCategory();

  const parentLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of allForParents.data?.items ?? []) {
      map.set(cat.id, cat.name);
    }
    return map;
  }, [allForParents.data]);

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(undefined);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success(`Categoría "${deleting.name}" eliminada`);
      setDeleting(undefined);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo eliminar';
      toast.error(message);
    }
  };

  const data = listQuery.data;
  const isLoading = listQuery.isLoading;
  const isError = listQuery.isError;
  const error = listQuery.error;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl lg:text-3xl mb-1">Categorías</h2>
            <p className="text-sm text-muted-foreground">
              Organiza tu catálogo en categorías y subcategorías.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus size={16} />
            <span>Nueva categoría</span>
          </Button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => {
                setIncludeInactive(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 rounded border-border bg-input-background"
            />
            Mostrar inactivas
          </label>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {isLoading ? (
            <CategoriesTableSkeleton />
          ) : isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar las categorías.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Error desconocido'}
              </p>
            </div>
          ) : data ? (
            <>
              <CategoriesTable
                categories={data.items}
                parentLookup={parentLookup}
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

      <CategoryFormModal
        isOpen={formOpen}
        onClose={closeForm}
        category={editing}
        parentOptions={allForParents.data?.items ?? []}
      />

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(undefined)}
        onConfirm={() => void confirmDelete()}
        title="Eliminar categoría"
        message={
          deleting
            ? `¿Seguro que quieres eliminar "${deleting.name}"? El back rechazará si tiene productos o subcategorías asociadas.`
            : ''
        }
      />
    </div>
  );
}

function CategoriesTableSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 px-4 flex items-center gap-4">
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-1/6 bg-muted rounded" />
          <div className="h-3 w-1/6 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
