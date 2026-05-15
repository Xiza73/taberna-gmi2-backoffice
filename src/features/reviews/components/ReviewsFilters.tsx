import { Select } from '@/components/ui/Select';
import { parseEnum } from '@/utils/parseEnum';

type StatusFilter = 'pending' | 'approved';
type RatingFilter = '' | '1' | '2' | '3' | '4' | '5';

const STATUS_VALUES = ['pending', 'approved'] as const;
const RATING_VALUES = ['', '1', '2', '3', '4', '5'] as const;

interface Props {
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  rating: RatingFilter;
  onRatingChange: (value: RatingFilter) => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pendientes de moderar' },
  { value: 'approved', label: 'Aprobadas' },
];

const ratingOptions = [
  { value: '', label: 'Todas las puntuaciones' },
  { value: '5', label: '★★★★★ — 5' },
  { value: '4', label: '★★★★☆ — 4' },
  { value: '3', label: '★★★☆☆ — 3' },
  { value: '2', label: '★★☆☆☆ — 2' },
  { value: '1', label: '★☆☆☆☆ — 1' },
];

export function ReviewsFilters({
  status,
  onStatusChange,
  rating,
  onRatingChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
      <Select
        label="Estado"
        options={statusOptions}
        value={status}
        onChange={(e) =>
          onStatusChange(
            parseEnum(e.currentTarget.value, STATUS_VALUES, 'pending'),
          )
        }
      />

      <Select
        label="Puntuación"
        options={ratingOptions}
        value={rating}
        onChange={(e) =>
          onRatingChange(parseEnum(e.currentTarget.value, RATING_VALUES, ''))
        }
      />
    </div>
  );
}
