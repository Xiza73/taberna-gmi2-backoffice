import { Check, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/utils/cn';
import { formatDateTime } from '@/utils/format';
import type { Review } from '@/types/reviews';
import { StarRating } from './StarRating';

interface Props {
  reviews: Review[];
  productLookup: Map<string, string>;
  onApprove: (review: Review) => void;
  onDelete: (review: Review) => void;
  approvingId?: string;
}

export function ReviewsTable({
  reviews,
  productLookup,
  onApprove,
  onDelete,
  approvingId,
}: Props) {
  if (reviews.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No hay reviews para mostrar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Puntuación</TableHead>
          <TableHead>Comentario</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Fecha</TableHead>
          <TableHead className="text-right w-[120px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => {
          const productName = productLookup.get(review.productId);
          const isApproving = approvingId === review.id;
          return (
            <TableRow key={review.id}>
              <TableCell className="text-sm">
                {productName ? (
                  <Link
                    to="/products"
                    className="hover:text-primary transition-colors"
                  >
                    {productName}
                  </Link>
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">
                    {review.productId.slice(0, 8)}…
                  </span>
                )}
              </TableCell>
              <TableCell>
                <StarRating rating={review.rating} />
              </TableCell>
              <TableCell className="text-sm max-w-[400px]">
                {review.comment ? (
                  <span className="line-clamp-2" title={review.comment}>
                    {review.comment}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">Sin comentario</span>
                )}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center text-xs px-2 py-0.5 rounded',
                    review.isApproved
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-400',
                  )}
                >
                  {review.isApproved ? 'Aprobada' : 'Pendiente'}
                </span>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                {formatDateTime(review.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-1">
                  {!review.isApproved && (
                    <button
                      type="button"
                      onClick={() => onApprove(review)}
                      disabled={isApproving}
                      className="p-1.5 rounded-md hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-colors disabled:opacity-50"
                      aria-label="Aprobar review"
                      title="Aprobar"
                    >
                      <Check size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(review)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Eliminar review"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
