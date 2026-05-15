import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { BannerPosition } from '@/types/banners';
import { parseEnum } from '@/utils/parseEnum';
import { BANNER_POSITIONS, positionLabels } from '../lib/position';

type PositionFilter = BannerPosition | '';
type StatusFilter = 'all' | 'active' | 'inactive';

const POSITION_VALUES = ['', ...BANNER_POSITIONS] as const;
const STATUS_VALUES = ['all', 'active', 'inactive'] as const;

interface Props {
  searchInput: string;
  onSearchChange: (value: string) => void;
  position: PositionFilter;
  onPositionChange: (value: PositionFilter) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
}

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];

export function BannersFilters({
  searchInput,
  onSearchChange,
  position,
  onPositionChange,
  status,
  onStatusChange,
}: Props) {
  const positionOptions = [
    { value: '', label: 'Todas las posiciones' },
    ...BANNER_POSITIONS.map((p) => ({ value: p, label: positionLabels[p] })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Buscar por título"
          placeholder="Oferta de verano…"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        label="Posición"
        options={positionOptions}
        value={position}
        onChange={(e) =>
          onPositionChange(parseEnum(e.currentTarget.value, POSITION_VALUES, ''))
        }
      />

      <Select
        label="Estado"
        options={statusOptions}
        value={status}
        onChange={(e) =>
          onStatusChange(parseEnum(e.currentTarget.value, STATUS_VALUES, 'all'))
        }
      />
    </div>
  );
}
