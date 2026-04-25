import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import type {
  Banner,
  BannerPosition,
  CreateBannerInput,
  UpdateBannerInput,
} from '@/types/banners';
import { BANNER_POSITIONS, positionLabels } from '../lib/position';
import {
  useCreateBanner,
  useUpdateBanner,
} from '../hooks/useBannerMutations';
import { BannerImagePicker } from './BannerImagePicker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  banner?: Banner;
}

interface FormValues {
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: BannerPosition;
  isActive: boolean;
  sortOrder: number;
  startDate: string;
  endDate: string;
}

function isoToDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

function dateInputToIsoStart(date: string): string {
  return `${date}T00:00:00.000Z`;
}

function dateInputToIsoEnd(date: string): string {
  return `${date}T23:59:59.999Z`;
}

function buildDefaults(banner?: Banner): FormValues {
  return {
    title: banner?.title ?? '',
    imageUrl: banner?.imageUrl ?? '',
    linkUrl: banner?.linkUrl ?? '',
    position: banner?.position ?? 'hero',
    isActive: banner?.isActive ?? true,
    sortOrder: banner?.sortOrder ?? 0,
    startDate: isoToDateInput(banner?.startDate),
    endDate: isoToDateInput(banner?.endDate),
  };
}

export function BannerFormModal({ isOpen, onClose, banner }: Props) {
  const isEdit = Boolean(banner);
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: buildDefaults() });

  useEffect(() => {
    if (isOpen) reset(buildDefaults(banner));
  }, [isOpen, banner, reset]);

  const imageUrl = watch('imageUrl');

  const positionOptions = BANNER_POSITIONS.map((p) => ({
    value: p,
    label: positionLabels[p],
  }));

  const onSubmit = async (values: FormValues) => {
    if (values.imageUrl.trim() === '') {
      toast.error('Subí una imagen para el banner');
      return;
    }
    if (
      values.startDate &&
      values.endDate &&
      values.endDate <= values.startDate
    ) {
      setError('endDate', { message: 'Debe ser posterior a la fecha de inicio' });
      return;
    }

    try {
      if (isEdit && banner) {
        const payload: UpdateBannerInput = {
          title: values.title,
          imageUrl: values.imageUrl,
          linkUrl: values.linkUrl.trim() === '' ? null : values.linkUrl.trim(),
          position: values.position,
          isActive: values.isActive,
          sortOrder: Number(values.sortOrder),
          startDate: values.startDate ? dateInputToIsoStart(values.startDate) : null,
          endDate: values.endDate ? dateInputToIsoEnd(values.endDate) : null,
        };
        await updateMutation.mutateAsync({ id: banner.id, input: payload });
        toast.success('Banner actualizado');
      } else {
        const payload: CreateBannerInput = {
          title: values.title,
          imageUrl: values.imageUrl,
          ...(values.linkUrl.trim() !== '' && { linkUrl: values.linkUrl.trim() }),
          position: values.position,
          isActive: values.isActive,
          sortOrder: Number(values.sortOrder),
          ...(values.startDate && {
            startDate: dateInputToIsoStart(values.startDate),
          }),
          ...(values.endDate && {
            endDate: dateInputToIsoEnd(values.endDate),
          }),
        };
        await createMutation.mutateAsync(payload);
        toast.success('Banner creado');
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
      title={isEdit ? `Editar ${banner?.title}` : 'Nuevo banner'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="w-full">
          <label className="block mb-2 text-sm text-muted-foreground">Imagen</label>
          <BannerImagePicker
            value={imageUrl}
            onChange={(url) => setValue('imageUrl', url)}
            disabled={isPending}
          />
          {errors.imageUrl && (
            <p className="mt-1.5 text-sm text-destructive">{errors.imageUrl.message}</p>
          )}
        </div>

        <Input
          label="Título (interno)"
          placeholder="Ofertas de verano 2026"
          error={errors.title?.message}
          {...register('title', {
            required: 'Título requerido',
            maxLength: { value: 255, message: 'Máximo 255 caracteres' },
          })}
        />

        <Input
          label="URL al hacer click — opcional"
          placeholder="/categorias/celulares"
          error={errors.linkUrl?.message}
          {...register('linkUrl', {
            maxLength: { value: 500, message: 'Máximo 500 caracteres' },
          })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Posición"
            options={positionOptions}
            {...register('position', { required: true })}
          />

          <Input
            label="Orden"
            type="number"
            min={0}
            {...register('sortOrder', {
              valueAsNumber: true,
              min: { value: 0, message: 'Mínimo 0' },
            })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Vigencia desde — opcional"
            type="date"
            {...register('startDate')}
          />
          <Input
            label="Vigencia hasta — opcional"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-input-background"
            {...register('isActive')}
          />
          Banner activo (visible en el storefront)
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
            {isPending ? 'Guardando…' : isEdit ? 'Guardar' : 'Crear banner'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
