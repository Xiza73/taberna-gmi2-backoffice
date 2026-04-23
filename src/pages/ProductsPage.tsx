import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useCategories } from '@/features/categories';
import {
  ProductsFilters,
  ProductsTable,
  useDeleteProduct,
  useProducts,
} from '@/features/products';
import { useDebounce } from '@/hooks/useDebounce';
import type { Product, ProductSortBy } from '@/types/products';

const PAGE_SIZE = 20;
const DEFAULT_SORT: ProductSortBy = 'newest';

export function ProductsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortBy, setSortBy] = useState<ProductSortBy>(DEFAULT_SORT);
  const [includeInactive, setIncludeInactive] = useState(true);
  const [deleting, setDeleting] = useState<Product | undefined>();

  const debouncedSearch = useDebounce(searchInput, 300);

  const listQuery = useProducts({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    categoryId: categoryId || undefined,
    sortBy,
    includeInactive,
  });

  const categoriesQuery = useCategories({
    page: 1,
    limit: 50,
    includeInactive: true,
  });

  const deleteMutation = useDeleteProduct();

  const categoryLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of categoriesQuery.data?.items ?? []) {
      map.set(cat.id, cat.name);
    }
    return map;
  }, [categoriesQuery.data]);

  const onSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };
  const onCategoryChange = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };
  const onSortChange = (value: ProductSortBy) => {
    setSortBy(value);
    setPage(1);
  };
  const onIncludeInactiveChange = (value: boolean) => {
    setIncludeInactive(value);
    setPage(1);
  };

  const handleEdit = (product: Product) => {
    void navigate({ to: '/products/$productId/edit', params: { productId: product.id } });
  };

  const handleNew = () => {
    void navigate({ to: '/products/new' });
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success(`Producto "${deleting.name}" eliminado`);
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
            <h2 className="text-2xl lg:text-3xl mb-1">Productos</h2>
            <p className="text-sm text-muted-foreground">
              Catálogo de productos de la tienda.
            </p>
          </div>
          <Button onClick={handleNew}>
            <Plus size={16} />
            <span>Nuevo producto</span>
          </Button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <ProductsFilters
            searchInput={searchInput}
            onSearchChange={onSearchChange}
            categoryId={categoryId}
            onCategoryChange={onCategoryChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            includeInactive={includeInactive}
            onIncludeInactiveChange={onIncludeInactiveChange}
            categories={categoriesQuery.data?.items ?? []}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {isLoading ? (
            <ProductsTableSkeleton />
          ) : isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar los productos.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Error desconocido'}
              </p>
            </div>
          ) : data ? (
            <>
              <ProductsTable
                products={data.items}
                categoryLookup={categoryLookup}
                onEdit={handleEdit}
                onDelete={setDeleting}
              />
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

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(undefined)}
        onConfirm={() => void confirmDelete()}
        title="Eliminar producto"
        message={
          deleting
            ? `¿Seguro que querés eliminar "${deleting.name}"? El producto se desactivará y se quitará de carritos y wishlists de clientes.`
            : ''
        }
      />
    </div>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 px-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-muted" />
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-1/6 bg-muted rounded" />
          <div className="h-3 w-1/6 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
