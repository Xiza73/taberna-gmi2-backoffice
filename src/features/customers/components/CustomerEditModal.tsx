import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { Customer, UpdateCustomerInput } from '@/types/customers';
import { useUpdateCustomer } from '../hooks/useCustomerMutations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | undefined;
}

interface FormValues {
  name: string;
  phone: string;
}

export function CustomerEditModal({ isOpen, onClose, customer }: Props) {
  const updateMutation = useUpdateCustomer(customer?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: '', phone: '' } });

  useEffect(() => {
    if (isOpen && customer) {
      reset({ name: customer.name, phone: customer.phone ?? '' });
    }
  }, [isOpen, customer, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!customer) return;
    try {
      const payload: UpdateCustomerInput = {
        name: values.name,
        phone: values.phone.trim() === '' ? undefined : values.phone.trim(),
      };
      await updateMutation.mutateAsync(payload);
      toast.success('Cliente actualizado');
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
      title={customer ? `Editar ${customer.name}` : 'Editar cliente'}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Nombre"
          autoFocus
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre requerido',
            maxLength: { value: 255, message: 'Máximo 255 caracteres' },
          })}
        />

        <Input
          label="Teléfono"
          placeholder="Opcional"
          error={errors.phone?.message}
          {...register('phone', {
            maxLength: { value: 50, message: 'Máximo 50 caracteres' },
          })}
        />

        <p className="text-xs text-muted-foreground">
          El email y la contraseña los modifica el cliente desde su propio perfil.
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
