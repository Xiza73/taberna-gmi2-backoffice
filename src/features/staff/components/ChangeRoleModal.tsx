import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import type { Staff, StaffRole } from '@/types/staff';
import { parseEnum } from '@/utils/parseEnum';
import { STAFF_ROLES, roleLabels } from '../lib/role';
import { useChangeStaffRole } from '../hooks/useStaffMutations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | undefined;
}

export function ChangeRoleModal({ isOpen, onClose, staff }: Props) {
  const mutation = useChangeStaffRole(staff?.id ?? '');
  const [role, setRole] = useState<StaffRole>('user');

  useEffect(() => {
    if (isOpen && staff) {
      setRole(staff.role);
    }
  }, [isOpen, staff]);

  const roleOptions = STAFF_ROLES.map((r) => ({
    value: r,
    label: roleLabels[r],
  }));

  const handleSubmit = async () => {
    if (!staff) return;
    if (role === staff.role) {
      onClose();
      return;
    }
    try {
      await mutation.mutateAsync({ role });
      toast.success(`Rol actualizado a ${roleLabels[role]}`);
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo cambiar el rol';
      toast.error(message);
    }
  };

  const isPending = mutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staff ? `Cambiar rol — ${staff.name}` : 'Cambiar rol'}
      size="sm"
    >
      <div className="space-y-4">
        <Select
          label="Nuevo rol"
          options={roleOptions}
          value={role}
          onChange={(e) => setRole(parseEnum(e.currentTarget.value, STAFF_ROLES, 'user'))}
          disabled={isPending}
        />

        <p className="text-xs text-muted-foreground">
          Solo el super admin puede modificar roles. Degradar al único super admin
          activo será rechazado por el back.
        </p>

        <div className="flex gap-3 pt-2 border-t border-border">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? 'Guardando…' : 'Guardar rol'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
