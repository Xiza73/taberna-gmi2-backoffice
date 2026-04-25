import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  rating: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, size = 14, className }: Props) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={`${rating} de 5 estrellas`}
      title={`${rating}/5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= rating;
        return (
          <Star
            key={n}
            size={size}
            className={
              filled
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/40'
            }
          />
        );
      })}
    </span>
  );
}
