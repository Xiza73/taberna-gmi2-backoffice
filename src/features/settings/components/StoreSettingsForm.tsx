import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type {
  StoreSettings,
  UpdateStoreSettingsInput,
} from '@/types/settings';
import {
  useStoreSettings,
  useUpdateStoreSettings,
} from '../hooks/useStoreSettings';

interface FormValues {
  storeName: string;
  legalName: string;
  ruc: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  email: string;
  currency: string;
  igvPercentage: number;
  logoUrl: string;
  faviconUrl: string;
}

interface Props {
  canEdit: boolean;
}

export function StoreSettingsForm({ canEdit }: Props) {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useStoreSettings();
  const updateMutation = useUpdateStoreSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: toFormValues(null),
  });

  useEffect(() => {
    if (data) reset(toFormValues(data));
  }, [data, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!canEdit) return;
    const input = toUpdateInput(values);
    try {
      await updateMutation.mutateAsync(input);
      toast.success('Configuración actualizada');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'No se pudo guardar';
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse" aria-hidden="true">
        <div className="h-9 rounded-md bg-muted/40" />
        <div className="h-9 rounded-md bg-muted/40" />
        <div className="h-9 rounded-md bg-muted/40" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-3">
        <div>
          <p className="text-sm text-destructive">
            No se pudo cargar la configuración.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void refetch()}
          disabled={isRefetching}
          className="self-start"
        >
          {isRefetching ? 'Reintentando…' : 'Reintentar'}
        </Button>
      </div>
    );
  }

  const isPending = updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Nombre de la tienda"
        disabled={!canEdit}
        error={errors.storeName?.message}
        {...register('storeName', {
          required: 'Nombre requerido',
          maxLength: { value: 255, message: 'Máximo 255 caracteres' },
        })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Razón social"
          disabled={!canEdit}
          error={errors.legalName?.message}
          {...register('legalName', {
            maxLength: { value: 255, message: 'Máximo 255 caracteres' },
          })}
        />
        <Input
          label="RUC"
          disabled={!canEdit}
          placeholder="11 dígitos"
          error={errors.ruc?.message}
          {...register('ruc', {
            pattern: {
              value: /^(\d{11})?$/,
              message: 'RUC debe tener exactamente 11 dígitos',
            },
          })}
        />
      </div>

      <Input
        label="Dirección"
        disabled={!canEdit}
        error={errors.address?.message}
        {...register('address', {
          maxLength: { value: 500, message: 'Máximo 500 caracteres' },
        })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Distrito"
          disabled={!canEdit}
          {...register('district', { maxLength: 100 })}
        />
        <Input
          label="Ciudad"
          disabled={!canEdit}
          {...register('city', { maxLength: 100 })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Teléfono"
          disabled={!canEdit}
          {...register('phone', { maxLength: 20 })}
        />
        <Input
          label="Email de contacto"
          type="email"
          disabled={!canEdit}
          error={errors.email?.message}
          {...register('email', {
            pattern: {
              value: /^(.+@.+\..+)?$/,
              message: 'Email inválido',
            },
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Moneda"
          disabled={!canEdit}
          placeholder="PEN"
          error={errors.currency?.message}
          {...register('currency', {
            required: 'Moneda requerida',
            maxLength: { value: 3, message: 'Código ISO de 3 letras' },
          })}
        />
        <Input
          label="IGV (%)"
          type="number"
          disabled={!canEdit}
          min={0}
          max={100}
          step={0.01}
          error={errors.igvPercentage?.message}
          {...register('igvPercentage', {
            required: 'IGV requerido',
            valueAsNumber: true,
            min: { value: 0, message: 'Mínimo 0' },
            max: { value: 100, message: 'Máximo 100' },
          })}
        />
      </div>

      <Input
        label="URL del logo"
        disabled={!canEdit}
        placeholder="https://res.cloudinary.com/…"
        {...register('logoUrl', { maxLength: 500 })}
      />
      <Input
        label="URL del favicon"
        disabled={!canEdit}
        placeholder="https://…"
        {...register('faviconUrl', { maxLength: 500 })}
      />

      {!canEdit && (
        <p className="text-xs text-muted-foreground">
          Solo el super admin puede modificar la configuración de la tienda.
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        {isDirty && canEdit && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => data && reset(toFormValues(data))}
            disabled={isPending}
          >
            Descartar
          </Button>
        )}
        {canEdit && (
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Guardando…' : 'Guardar'}
          </Button>
        )}
      </div>
    </form>
  );
}

function toFormValues(s: StoreSettings | null): FormValues {
  return {
    storeName: s?.storeName ?? '',
    legalName: s?.legalName ?? '',
    ruc: s?.ruc ?? '',
    address: s?.address ?? '',
    district: s?.district ?? '',
    city: s?.city ?? '',
    phone: s?.phone ?? '',
    email: s?.email ?? '',
    currency: s?.currency ?? 'PEN',
    igvPercentage: s?.igvPercentage ?? 18,
    logoUrl: s?.logoUrl ?? '',
    faviconUrl: s?.faviconUrl ?? '',
  };
}

function toUpdateInput(v: FormValues): UpdateStoreSettingsInput {
  const trim = (s: string) => s.trim();
  const nullable = (s: string) => {
    const t = trim(s);
    return t.length === 0 ? null : t;
  };
  return {
    storeName: trim(v.storeName),
    legalName: nullable(v.legalName),
    ruc: nullable(v.ruc),
    address: nullable(v.address),
    district: nullable(v.district),
    city: nullable(v.city),
    phone: nullable(v.phone),
    email: nullable(v.email),
    currency: trim(v.currency) || 'PEN',
    igvPercentage: v.igvPercentage,
    logoUrl: nullable(v.logoUrl),
    faviconUrl: nullable(v.faviconUrl),
  };
}
