import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/categories';
import { slugify } from '@/utils/slugify';
import {
  useCreateCategory,
  useUpdateCategory,
} from '../hooks/useCategoryMutations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  parentOptions: Category[];
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  isActive: boolean;
  sortOrder: number;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function CategoryFormModal({
  isOpen,
  onClose,
  category,
  parentOptions,
}: Props) {
  const isEdit = Boolean(category);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: '',
      isActive: true,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        parentId: category.parentId ?? '',
        isActive: category.isActive,
        sortOrder: category.sortOrder,
      });
      setSlugTouched(true);
    } else {
      reset({
        name: '',
        slug: '',
        description: '',
        parentId: '',
        isActive: true,
        sortOrder: 0,
      });
      setSlugTouched(false);
    }
  }, [isOpen, category, reset]);

  const nameValue = watch('name');
  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(nameValue ?? ''), { shouldValidate: false });
    }
  }, [nameValue, slugTouched, setValue]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && category) {
        const payload: UpdateCategoryInput = {
          name: values.name,
          slug: values.slug,
          description: values.description.trim() === '' ? null : values.description,
          parentId: values.parentId === '' ? null : values.parentId,
          isActive: values.isActive,
          sortOrder: Number(values.sortOrder),
        };
        await updateMutation.mutateAsync({ id: category.id, input: payload });
        toast.success('Categoría actualizada');
      } else {
        const payload: CreateCategoryInput = {
          name: values.name,
          slug: values.slug,
          ...(values.description.trim() !== '' && { description: values.description }),
          ...(values.parentId !== '' && { parentId: values.parentId }),
          isActive: values.isActive,
          sortOrder: Number(values.sortOrder),
        };
        await createMutation.mutateAsync(payload);
        toast.success('Categoría creada');
      }
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error inesperado';
      if (err instanceof ApiError && err.code === 'CONFLICT') {
        setError('slug', { message: 'El slug ya está en uso' });
        toast.error(message);
        return;
      }
      toast.error(message);
    }
  };

  const filteredParents = parentOptions.filter((p) => p.id !== category?.id);
  const parentSelectOptions = [
    { value: '', label: '— Sin categoría padre —' },
    ...filteredParents.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar categoría' : 'Nueva categoría'}
      size="md"
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
          label="Slug"
          error={errors.slug?.message}
          {...register('slug', {
            required: 'Slug requerido',
            maxLength: { value: 255, message: 'Máximo 255 caracteres' },
            pattern: {
              value: slugPattern,
              message: 'Sólo minúsculas, números y guiones (ej: zapatos-deportivos)',
            },
            onChange: () => setSlugTouched(true),
          })}
        />

        <div className="w-full">
          <label className="block mb-2 text-sm text-muted-foreground">Descripción</label>
          <Textarea
            rows={3}
            {...register('description', {
              maxLength: { value: 5000, message: 'Máximo 5000 caracteres' },
            })}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <Select
          label="Categoría padre"
          options={parentSelectOptions}
          {...register('parentId')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Orden"
            type="number"
            min={0}
            error={errors.sortOrder?.message}
            {...register('sortOrder', {
              valueAsNumber: true,
              min: { value: 0, message: 'Mínimo 0' },
            })}
          />
          <label className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-input-background"
              {...register('isActive')}
            />
            <span className="text-sm">Activa</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose} disabled={isPending} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? 'Guardando…' : isEdit ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
