import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { Staff } from '@/types/staff';
import { useUpdateStaff } from '../hooks/useStaffMutations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | undefined;
}

interface FormValues {
  name: string;
}

export function StaffEditModal({ isOpen, onClose, staff }: Props) {
  const updateMutation = useUpdateStaff(staff?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: '' } });

  useEffect(() => {
    if (isOpen && staff) {
      reset({ name: staff.name });
    }
  }, [isOpen, staff, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!staff) return;
    try {
      await updateMutation.mutateAsync({ name: values.name });
      toast.success('Staff actualizado');
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo guardar';
      toast.error(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staff ? `Editar ${staff.name}` : 'Editar staff'}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Nombre"
          autoFocus
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre requerido',
            maxLength: { value: 100, message: 'Máximo 100 caracteres' },
          })}
        />

        <p className="text-xs text-muted-foreground">
          Email y rol se modifican desde acciones dedicadas. Invitá un nuevo staff
          si necesitás registrar a otra persona.
        </p>

        <div className="flex gap-3 pt-2 border-t border-border">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1"
          >
            {updateMutation.isPending ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
