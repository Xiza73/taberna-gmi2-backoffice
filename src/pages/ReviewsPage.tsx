import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import { useProducts } from '@/features/products';
import {
  ReviewsFilters,
  ReviewsTable,
  useApproveReview,
  useDeleteReview,
  useReviews,
} from '@/features/reviews';
import type { Review } from '@/types/reviews';

const PAGE_SIZE = 20;

type StatusFilter = 'pending' | 'approved';
type RatingFilter = '' | '1' | '2' | '3' | '4' | '5';

export function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>('pending');
  const [rating, setRating] = useState<RatingFilter>('');
  const [deleting, setDeleting] = useState<Review | undefined>();

  const listQuery = useReviews({
    page,
    limit: PAGE_SIZE,
    isApproved: status === 'approved',
    rating: rating === '' ? undefined : Number(rating),
  });

  // Best-effort product lookup (top 50). Reviews outside this slice fall back
  // to truncated UUID in the table.
  const productsForLookup = useProducts({
    page: 1,
    limit: 50,
    includeInactive: true,
  });

  const productLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of productsForLookup.data?.items ?? []) {
      map.set(p.id, p.name);
    }
    return map;
  }, [productsForLookup.data]);

  const approveMutation = useApproveReview();
  const deleteMutation = useDeleteReview();

  const onStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };
  const onRatingChange = (v: RatingFilter) => {
    setRating(v);
    setPage(1);
  };

  const handleApprove = async (review: Review) => {
    try {
      await approveMutation.mutateAsync(review.id);
      toast.success('Review aprobada — visible en la tienda');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo aprobar';
      toast.error(message);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const target = deleting;
    setDeleting(undefined);
    try {
      await deleteMutation.mutateAsync(target.id);
      toast.success('Review eliminada');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo eliminar';
      toast.error(message);
    }
  };

  const data = listQuery.data;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Reseñas</h2>
          <p className="text-sm text-muted-foreground">
            Moderación de reseñas. Las pendientes se muestran por default; aprobalas
            para que aparezcan en la tienda.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <ReviewsFilters
            status={status}
            onStatusChange={onStatusChange}
            rating={rating}
            onRatingChange={onRatingChange}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {listQuery.isLoading ? (
            <ReviewsTableSkeleton />
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar las reseñas.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {listQuery.error instanceof Error
                  ? listQuery.error.message
                  : 'Error desconocido'}
              </p>
            </div>
          ) : data ? (
            <>
              <ReviewsTable
                reviews={data.items}
                productLookup={productLookup}
                onApprove={(r) => void handleApprove(r)}
                onDelete={setDeleting}
                approvingId={
                  approveMutation.isPending ? approveMutation.variables : undefined
                }
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
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(undefined)}
        onConfirm={() => void confirmDelete()}
        title="Eliminar reseña"
        message={
          deleting
            ? deleting.isApproved
              ? '¿Eliminar esta reseña aprobada? Se recalcula el rating promedio del producto. La acción es irreversible.'
              : '¿Eliminar esta reseña pendiente? La acción es irreversible.'
            : ''
        }
      />
    </div>
  );
}

function ReviewsTableSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 px-4 flex items-center gap-4">
          <div className="h-3 w-1/5 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-3 w-1/3 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
