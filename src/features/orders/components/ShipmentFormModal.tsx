import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type {
  Carrier,
  CreateShipmentInput,
  Shipment,
  UpdateShipmentInput,
} from '@/types/shipments';
import { CARRIERS, carrierLabels } from '../lib/carrier';
import {
  useCreateShipment,
  useUpdateShipment,
} from '../hooks/useShipmentMutations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  shipment?: Shipment;
}

interface FormValues {
  carrier: Carrier;
  trackingNumber: string;
  trackingUrl: string;
  notes: string;
}

const defaultValues: FormValues = {
  carrier: 'olva',
  trackingNumber: '',
  trackingUrl: '',
  notes: '',
};

export function ShipmentFormModal({ isOpen, onClose, orderId, shipment }: Props) {
  const isEdit = Boolean(shipment);
  const createMutation = useCreateShipment(orderId);
  const updateMutation = useUpdateShipment(orderId);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  useEffect(() => {
    if (!isOpen) return;
    if (shipment) {
      reset({
        carrier: shipment.carrier,
        trackingNumber: shipment.trackingNumber,
        trackingUrl: shipment.trackingUrl,
        notes: shipment.notes ?? '',
      });
    } else {
      reset(defaultValues);
    }
  }, [isOpen, shipment, reset]);

  const carrierOptions = CARRIERS.map((c) => ({
    value: c,
    label: carrierLabels[c],
  }));

  const onSubmit = async (values: FormValues) => {
    const isOther = values.carrier === 'other';
    const trackingUrl = values.trackingUrl.trim();

    if (isOther && trackingUrl === '') {
      toast.error('Para "Otro" carrier, la URL de tracking es obligatoria.');
      return;
    }

    try {
      if (isEdit && shipment) {
        const payload: UpdateShipmentInput = {
          carrier: values.carrier,
          trackingNumber: values.trackingNumber,
          ...(trackingUrl !== '' && { trackingUrl }),
          ...(values.notes.trim() !== '' && { notes: values.notes }),
        };
        await updateMutation.mutateAsync(payload);
        toast.success('Envío actualizado');
      } else {
        const payload: CreateShipmentInput = {
          carrier: values.carrier,
          trackingNumber: values.trackingNumber,
          ...(trackingUrl !== '' && { trackingUrl }),
          ...(values.notes.trim() !== '' && { notes: values.notes }),
        };
        await createMutation.mutateAsync(payload);
        toast.success('Envío registrado. El pedido pasó a "Enviada".');
      }
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error inesperado';
      toast.error(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar envío' : 'Registrar envío'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Select
          label="Transportista"
          options={carrierOptions}
          {...register('carrier', { required: 'Transportista requerido' })}
        />

        <Input
          label="Número de tracking"
          placeholder="Ej: OLV-2026-12345"
          error={errors.trackingNumber?.message}
          {...register('trackingNumber', {
            required: 'Número de tracking requerido',
          })}
        />

        <Input
          label="URL de tracking (opcional)"
          placeholder="Auto-generada según carrier — completar solo si el back no la genera"
          error={errors.trackingUrl?.message}
          {...register('trackingUrl')}
        />

        <div className="w-full">
          <label className="block mb-2 text-sm text-muted-foreground">
            Notas (opcional)
          </label>
          <Textarea
            rows={2}
            placeholder="Notas internas sobre el envío…"
            {...register('notes', { maxLength: 2000 })}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? 'Guardando…' : isEdit ? 'Guardar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
