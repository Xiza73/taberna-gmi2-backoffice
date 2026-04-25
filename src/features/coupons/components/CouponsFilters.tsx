import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { CouponType } from '@/types/coupons';
import { COUPON_TYPES, couponTypeLabels } from '../lib/couponType';

type TypeFilter = CouponType | '';
type StatusFilter = 'all' | 'active' | 'inactive';

interface Props {
  searchInput: string;
  onSearchChange: (value: string) => void;
  type: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
}

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];

export function CouponsFilters({
  searchInput,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
}: Props) {
  const typeOptions = [
    { value: '', label: 'Todos los tipos' },
    ...COUPON_TYPES.map((t) => ({ value: t, label: couponTypeLabels[t] })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Buscar por código"
          placeholder="VERANO20"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value.toUpperCase())}
          className="pl-9 uppercase"
        />
      </div>

      <Select
        label="Tipo"
        options={typeOptions}
        value={type}
        onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
      />

      <Select
        label="Estado"
        options={statusOptions}
        value={status}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
      />
    </div>
  );
}
