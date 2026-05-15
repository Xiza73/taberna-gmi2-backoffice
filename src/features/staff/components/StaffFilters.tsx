import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { StaffRole } from '@/types/staff';
import { parseEnum } from '@/utils/parseEnum';
import { STAFF_ROLES, roleLabels } from '../lib/role';

type RoleFilter = StaffRole | '';
type StatusFilter = 'all' | 'active' | 'inactive';

const ROLE_VALUES = ['', ...STAFF_ROLES] as const;
const STATUS_VALUES = ['all', 'active', 'inactive'] as const;

interface Props {
  searchInput: string;
  onSearchChange: (value: string) => void;
  role: RoleFilter;
  onRoleChange: (value: RoleFilter) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
}

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Suspendidos' },
];

export function StaffFilters({
  searchInput,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: Props) {
  const roleOptions = [
    { value: '', label: 'Todos los roles' },
    ...STAFF_ROLES.map((r) => ({ value: r, label: roleLabels[r] })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
      <div className="relative md:col-span-1">
        <Search
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Buscar"
          placeholder="Nombre o email…"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        label="Rol"
        options={roleOptions}
        value={role}
        onChange={(e) =>
          onRoleChange(parseEnum(e.currentTarget.value, ROLE_VALUES, ''))
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
