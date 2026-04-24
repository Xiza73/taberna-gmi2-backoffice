import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type StatusFilter = 'all' | 'active' | 'inactive';

interface Props {
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
}

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Suspendidos' },
];

export function CustomersFilters({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
      <div className="relative md:col-span-2">
        <Search
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Buscar"
          placeholder="Nombre, email o teléfono…"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        label="Estado"
        options={statusOptions}
        value={status}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
      />
    </div>
  );
}
