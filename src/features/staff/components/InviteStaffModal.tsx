import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import type { InviteStaffInput, StaffRole } from '@/types/staff';
import { roleLabels } from '../lib/role';
import { useInviteStaff } from '../hooks/useStaffInvitations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: StaffRole;
}

interface FormValues {
  email: string;
  role: StaffRole;
}

function rolesInvitableBy(role: StaffRole): StaffRole[] {
  if (role === 'super_admin') return ['admin', 'user'];
  if (role === 'admin') return ['user'];
  return [];
}

export function InviteStaffModal({ isOpen, onClose, currentUserRole }: Props) {
  const mutation = useInviteStaff();
  const allowedRoles = useMemo(
    () => rolesInvitableBy(currentUserRole),
    [currentUserRole],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', role: allowedRoles[0] ?? 'user' },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ email: '', role: allowedRoles[0] ?? 'user' });
    }
  }, [isOpen, allowedRoles, reset]);

  const roleOptions = allowedRoles.map((r) => ({
    value: r,
    label: roleLabels[r],
  }));

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: InviteStaffInput = {
        email: values.email.trim(),
        role: values.role,
      };
      await mutation.mutateAsync(payload);
      toast.success(`Invitación enviada a ${payload.email}`);
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo invitar';
      toast.error(message);
    }
  };

  if (allowedRoles.length === 0) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invitar staff" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoFocus
          placeholder="persona@empresa.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email requerido',
            pattern: { value: /.+@.+\..+/, message: 'Email inválido' },
          })}
        />

        <Select
          label="Rol"
          options={roleOptions}
          {...register('role', { required: true })}
        />

        <p className="text-xs text-muted-foreground">
          Recibirá un email con un link para registrarse y elegir su contraseña.
          La invitación expira en 72h.
        </p>

        <div className="flex gap-3 pt-2 border-t border-border">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1"
          >
            {mutation.isPending ? 'Enviando…' : 'Enviar invitación'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
