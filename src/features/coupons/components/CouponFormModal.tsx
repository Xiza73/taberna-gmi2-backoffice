import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { centsToSolesString, solesStringToCents } from '@/utils/format';
import type {
  Coupon,
  CouponType,
  CreateCouponInput,
  UpdateCouponInput,
} from '@/types/coupons';
import { COUPON_TYPES, couponTypeLabels } from '../lib/couponType';
import {
  useCreateCoupon,
  useUpdateCoupon,
} from '../hooks/useCouponMutations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  coupon?: Coupon;
}

interface FormValues {
  code: string;
  type: CouponType;
  // For percentage: value is 1-100 directly. For fixed_amount: value is in S/. (string).
  valuePercent: number;
  valueSoles: string;
  minPurchaseSoles: string;
  maxDiscountSoles: string;
  maxUses: string;
  maxUsesPerUser: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

function isoToDateInput(iso: string | undefined): string {
  if (!iso) return '';
  return iso.slice(0, 10); // "YYYY-MM-DD"
}

function dateInputToIsoStart(date: string): string {
  return `${date}T00:00:00.000Z`;
}

function dateInputToIsoEnd(date: string): string {
  return `${date}T23:59:59.999Z`;
}

function buildDefaults(coupon?: Coupon): FormValues {
  return {
    code: coupon?.code ?? '',
    type: coupon?.type ?? 'percentage',
    valuePercent: coupon?.type === 'percentage' ? coupon.value : 10,
    valueSoles: coupon?.type === 'fixed_amount' ? centsToSolesString(coupon.value) : '',
    minPurchaseSoles: centsToSolesString(coupon?.minPurchase),
    maxDiscountSoles: centsToSolesString(coupon?.maxDiscount),
    maxUses: coupon?.maxUses != null ? String(coupon.maxUses) : '',
    maxUsesPerUser: coupon?.maxUsesPerUser != null ? String(coupon.maxUsesPerUser) : '1',
    isActive: coupon?.isActive ?? true,
    startDate: isoToDateInput(coupon?.startDate),
    endDate: isoToDateInput(coupon?.endDate),
  };
}

export function CouponFormModal({ isOpen, onClose, coupon }: Props) {
  const isEdit = Boolean(coupon);
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: buildDefaults() });

  useEffect(() => {
    if (isOpen) reset(buildDefaults(coupon));
  }, [isOpen, coupon, reset]);

  const type = watch('type');
  const isPercentage = type === 'percentage';

  const typeOptions = COUPON_TYPES.map((t) => ({
    value: t,
    label: couponTypeLabels[t],
  }));

  const onSubmit = async (values: FormValues) => {
    // Compute value cents from the right field depending on type
    let valueCents: number;
    if (isPercentage) {
      valueCents = Number(values.valuePercent);
      if (valueCents < 1 || valueCents > 100) {
        setError('valuePercent', { message: 'Entre 1 y 100' });
        return;
      }
    } else {
      valueCents = solesStringToCents(values.valueSoles);
      if (valueCents <= 0) {
        setError('valueSoles', { message: 'Debe ser mayor a 0' });
        return;
      }
    }

    const minPurchase =
      values.minPurchaseSoles.trim() === ''
        ? null
        : solesStringToCents(values.minPurchaseSoles);
    const maxDiscount =
      isPercentage && values.maxDiscountSoles.trim() !== ''
        ? solesStringToCents(values.maxDiscountSoles)
        : null;
    const maxUses =
      values.maxUses.trim() === '' ? null : Number.parseInt(values.maxUses, 10);
    const maxUsesPerUser =
      values.maxUsesPerUser.trim() === ''
        ? null
        : Number.parseInt(values.maxUsesPerUser, 10);

    if (!values.startDate || !values.endDate) {
      toast.error('Las fechas son obligatorias');
      return;
    }
    if (values.endDate <= values.startDate) {
      setError('endDate', { message: 'Debe ser posterior a la fecha de inicio' });
      return;
    }

    try {
      if (isEdit && coupon) {
        const payload: UpdateCouponInput = {
          code: values.code.toUpperCase(),
          type: values.type,
          value: valueCents,
          minPurchase,
          maxDiscount,
          maxUses,
          maxUsesPerUser,
          isActive: values.isActive,
          startDate: dateInputToIsoStart(values.startDate),
          endDate: dateInputToIsoEnd(values.endDate),
        };
        await updateMutation.mutateAsync({ id: coupon.id, input: payload });
        toast.success('Cupón actualizado');
      } else {
        const payload: CreateCouponInput = {
          code: values.code.toUpperCase(),
          type: values.type,
          value: valueCents,
          ...(minPurchase !== null && { minPurchase }),
          ...(maxDiscount !== null && { maxDiscount }),
          ...(maxUses !== null && { maxUses }),
          ...(maxUsesPerUser !== null && { maxUsesPerUser }),
          isActive: values.isActive,
          startDate: dateInputToIsoStart(values.startDate),
          endDate: dateInputToIsoEnd(values.endDate),
        };
        await createMutation.mutateAsync(payload);
        toast.success('Cupón creado');
      }
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error inesperado';
      if (err instanceof ApiError && err.code === 'CONFLICT') {
        setError('code', { message: 'Ese código ya está en uso' });
      }
      toast.error(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Editar ${coupon?.code}` : 'Nuevo cupón'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Código"
          autoFocus
          placeholder="VERANO20"
          className="uppercase font-mono"
          error={errors.code?.message}
          {...register('code', {
            required: 'Código requerido',
            maxLength: { value: 50, message: 'Máximo 50 caracteres' },
            pattern: {
              value: /^[A-Z0-9_-]+$/i,
              message: 'Sólo letras, números, guiones y guiones bajos',
            },
          })}
        />

        <Select
          label="Tipo"
          options={typeOptions}
          {...register('type', { required: true })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isPercentage ? (
            <Input
              label="Descuento (%)"
              type="number"
              min={1}
              max={100}
              step={1}
              placeholder="20"
              error={errors.valuePercent?.message}
              {...register('valuePercent', {
                valueAsNumber: true,
                required: 'Requerido',
                min: { value: 1, message: 'Mínimo 1' },
                max: { value: 100, message: 'Máximo 100' },
              })}
            />
          ) : (
            <Input
              label="Descuento (S/.)"
              type="number"
              step="0.01"
              min={0.01}
              placeholder="50.00"
              error={errors.valueSoles?.message}
              {...register('valueSoles', { required: 'Requerido' })}
            />
          )}

          {isPercentage && (
            <Input
              label="Tope de descuento (S/.) — opcional"
              type="number"
              step="0.01"
              min={0}
              placeholder="100.00"
              {...register('maxDiscountSoles')}
            />
          )}

          <Input
            label="Compra mínima (S/.) — opcional"
            type="number"
            step="0.01"
            min={0}
            placeholder="0.00"
            {...register('minPurchaseSoles')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Usos máx totales (vacío = ∞)"
            type="number"
            min={1}
            placeholder="100"
            {...register('maxUses')}
          />
          <Input
            label="Usos máx por cliente (vacío = ∞)"
            type="number"
            min={1}
            placeholder="1"
            {...register('maxUsesPerUser')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha de inicio"
            type="date"
            min="2020-01-01"
            max="2040-12-31"
            error={errors.startDate?.message}
            {...register('startDate', { required: 'Requerida' })}
          />
          <Input
            label="Fecha de fin"
            type="date"
            min="2020-01-01"
            max="2040-12-31"
            error={errors.endDate?.message}
            {...register('endDate', { required: 'Requerida' })}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-input-background"
            {...register('isActive')}
          />
          Cupón activo (los clientes pueden aplicarlo)
        </label>

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
            {isPending ? 'Guardando…' : isEdit ? 'Guardar' : 'Crear cupón'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
