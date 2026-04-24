import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/features/auth';
import {
  ChangeRoleModal,
  StaffEditModal,
  StaffFilters,
  StaffTable,
  useActivateStaff,
  useStaffList,
  useSuspendStaff,
} from '@/features/staff';
import { useDebounce } from '@/hooks/useDebounce';
import type { Staff, StaffRole } from '@/types/staff';

const PAGE_SIZE = 20;

type RoleFilter = StaffRole | '';
type StatusFilter = 'all' | 'active' | 'inactive';

export function UsersPage() {
  const { me } = useAuth();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [role, setRole] = useState<RoleFilter>('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [editing, setEditing] = useState<Staff | undefined>();
  const [changingRole, setChangingRole] = useState<Staff | undefined>();
  const [togglingActive, setTogglingActive] = useState<Staff | undefined>();

  const debouncedSearch = useDebounce(searchInput, 300);

  const isActiveFilter =
    status === 'active' ? true : status === 'inactive' ? false : undefined;

  const listQuery = useStaffList({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    role: role === '' ? undefined : role,
    isActive: isActiveFilter,
  });

  const suspendMutation = useSuspendStaff();
  const activateMutation = useActivateStaff();

  const onSearchChange = (v: string) => {
    setSearchInput(v);
    setPage(1);
  };
  const onRoleChange = (v: RoleFilter) => {
    setRole(v);
    setPage(1);
  };
  const onStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };

  const confirmToggleActive = async () => {
    if (!togglingActive) return;
    const target = togglingActive;
    setTogglingActive(undefined);
    try {
      if (target.isActive) {
        await suspendMutation.mutateAsync(target.id);
        toast.success(`${target.name} suspendido`);
      } else {
        await activateMutation.mutateAsync(target.id);
        toast.success(`${target.name} activado`);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo cambiar el estado';
      toast.error(message);
    }
  };

  const canChangeRole = me?.role === 'super_admin';
  const data = listQuery.data;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Staff</h2>
          <p className="text-sm text-muted-foreground">
            Personal del backoffice. Invitaciones disponibles en el próximo PR.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <StaffFilters
            searchInput={searchInput}
            onSearchChange={onSearchChange}
            role={role}
            onRoleChange={onRoleChange}
            status={status}
            onStatusChange={onStatusChange}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {listQuery.isLoading ? (
            <StaffTableSkeleton />
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudo cargar el staff.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {listQuery.error instanceof Error
                  ? listQuery.error.message
                  : 'Error desconocido'}
              </p>
            </div>
          ) : data && me ? (
            <>
              <StaffTable
                staff={data.items}
                currentUserId={me.id}
                canChangeRole={canChangeRole}
                onEdit={setEditing}
                onChangeRole={setChangingRole}
                onToggleActive={setTogglingActive}
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

      <StaffEditModal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(undefined)}
        staff={editing}
      />

      <ChangeRoleModal
        isOpen={Boolean(changingRole)}
        onClose={() => setChangingRole(undefined)}
        staff={changingRole}
      />

      <ConfirmDialog
        isOpen={Boolean(togglingActive)}
        onClose={() => setTogglingActive(undefined)}
        onConfirm={() => void confirmToggleActive()}
        title={togglingActive?.isActive ? 'Suspender staff' : 'Activar staff'}
        message={
          togglingActive
            ? togglingActive.isActive
              ? `¿Suspender a ${togglingActive.name}? No podrá iniciar sesión hasta que lo actives de nuevo. El back rechaza si es el último super admin activo.`
              : `¿Activar a ${togglingActive.name}? Va a poder iniciar sesión inmediatamente.`
            : ''
        }
        confirmLabel={togglingActive?.isActive ? 'Suspender' : 'Activar'}
        variant={togglingActive?.isActive ? 'destructive' : 'primary'}
      />
    </div>
  );
}

function StaffTableSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 px-4 flex items-center gap-4">
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
