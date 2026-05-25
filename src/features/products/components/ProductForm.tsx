import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useCategories } from '@/features/categories';
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '@/types/products';
import { centsToSolesString, solesStringToCents } from '@/utils/format';
import { slugify } from '@/utils/slugify';
import {
  useCreateProduct,
  useUpdateProduct,
} from '../hooks/useProductMutations';
import { ProductImageGallery } from './ProductImageGallery';

interface Props {
  mode: 'create' | 'edit';
  product?: Product;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
  priceSoles: string;
  compareAtPriceSoles: string;
  sku: string;
  stock: number;
  categoryId: string;
  isActive: boolean;
  images: string[];
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function buildDefaults(product?: Product): FormValues {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    priceSoles: centsToSolesString(product?.price),
    compareAtPriceSoles: centsToSolesString(product?.compareAtPrice),
    sku: product?.sku ?? '',
    stock: product?.stock ?? 0,
    categoryId: product?.categoryId ?? '',
    isActive: product?.isActive ?? true,
    images: product?.images ?? [],
  };
}

export function ProductForm({ mode, product, onSuccess, onCancel }: Props) {
  const isEdit = mode === 'edit';
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const categoriesQuery = useCategories({
    page: 1,
    limit: 50,
    includeInactive: true,
  });
  const categories = categoriesQuery.data?.items ?? [];

  const [slugTouched, setSlugTouched] = useState(isEdit);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: buildDefaults(product) });

  const nameValue = watch('name');
  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(nameValue ?? ''), { shouldValidate: false });
    }
  }, [nameValue, slugTouched, setValue]);

  const images = watch('images');

  const onSubmit = async (values: FormValues) => {
    const priceCents = solesStringToCents(values.priceSoles);
    if (priceCents <= 0) {
      setError('priceSoles', { message: 'El precio debe ser mayor a 0' });
      return;
    }

    let compareAtCents: number | null = null;
    if (values.compareAtPriceSoles.trim() !== '') {
      compareAtCents = solesStringToCents(values.compareAtPriceSoles);
      if (compareAtCents <= priceCents) {
        setError('compareAtPriceSoles', {
          message: 'Debe ser mayor que el precio actual',
        });
        return;
      }
    }

    if (values.images.length === 0) {
      toast.error('Sube al menos una imagen del producto');
      return;
    }

    try {
      if (isEdit && product) {
        const payload: UpdateProductInput = {
          name: values.name,
          slug: values.slug,
          description: values.description,
          price: priceCents,
          compareAtPrice: compareAtCents,
          sku: values.sku.trim() === '' ? null : values.sku.trim(),
          stock: Number(values.stock),
          images: values.images,
          categoryId: values.categoryId,
          isActive: values.isActive,
        };
        const updated = await updateMutation.mutateAsync({
          id: product.id,
          input: payload,
        });
        toast.success('Producto actualizado');
        onSuccess(updated);
      } else {
        const payload: CreateProductInput = {
          name: values.name,
          slug: values.slug,
          description: values.description,
          price: priceCents,
          ...(compareAtCents !== null && { compareAtPrice: compareAtCents }),
          ...(values.sku.trim() !== '' && { sku: values.sku.trim() }),
          stock: Number(values.stock),
          images: values.images,
          categoryId: values.categoryId,
          isActive: values.isActive,
        };
        const created = await createMutation.mutateAsync(payload);
        toast.success('Producto creado');
        onSuccess(created);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error inesperado';
      if (err instanceof ApiError && err.code === 'CONFLICT') {
        if (message.toLowerCase().includes('slug')) {
          setError('slug', { message: 'El slug ya está en uso' });
        } else if (message.toLowerCase().includes('sku')) {
          setError('sku', { message: 'El SKU ya está en uso' });
        }
        toast.error(message);
        return;
      }
      toast.error(message);
    }
  };

  const categoryOptions = [
    { value: '', label: '— Seleccionar categoría —' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <section className="bg-card border border-border rounded-lg p-4 lg:p-6 space-y-4">
        <h3 className="text-sm text-muted-foreground">Información general</h3>

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
              message: 'Sólo minúsculas, números y guiones',
            },
            onChange: () => setSlugTouched(true),
          })}
        />

        <div className="w-full">
          <label className="block mb-2 text-sm text-muted-foreground">Descripción</label>
          <Textarea
            rows={4}
            {...register('description', {
              required: 'Descripción requerida',
              maxLength: { value: 5000, message: 'Máximo 5000 caracteres' },
            })}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <Select
          label="Categoría"
          options={categoryOptions}
          error={errors.categoryId?.message}
          {...register('categoryId', { required: 'Categoría requerida' })}
        />
      </section>

      <section className="bg-card border border-border rounded-lg p-4 lg:p-6 space-y-4">
        <h3 className="text-sm text-muted-foreground">Precio e inventario</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Precio (S/.)"
            type="number"
            step="0.01"
            min={0.01}
            placeholder="0.00"
            error={errors.priceSoles?.message}
            {...register('priceSoles', {
              required: 'Precio requerido',
            })}
          />

          <Input
            label="Precio anterior (S/.) — opcional"
            type="number"
            step="0.01"
            min={0}
            placeholder="0.00"
            error={errors.compareAtPriceSoles?.message}
            {...register('compareAtPriceSoles')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="SKU"
            placeholder="Opcional, único"
            error={errors.sku?.message}
            {...register('sku', {
              maxLength: { value: 50, message: 'Máximo 50 caracteres' },
            })}
          />

          <Input
            label="Stock"
            type="number"
            min={0}
            error={errors.stock?.message}
            {...register('stock', {
              valueAsNumber: true,
              min: { value: 0, message: 'No puede ser negativo' },
            })}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-input-background"
            {...register('isActive')}
          />
          Producto activo (visible en la tienda)
        </label>
      </section>

      <section className="bg-card border border-border rounded-lg p-4 lg:p-6 space-y-4">
        <h3 className="text-sm text-muted-foreground">Imágenes</h3>
        <ProductImageGallery
          value={images}
          onChange={(next) => setValue('images', next, { shouldValidate: false })}
          disabled={isPending}
        />
      </section>

      <div className="flex gap-3 sticky bottom-0 bg-background/80 backdrop-blur-sm py-3 -mx-4 lg:-mx-6 px-4 lg:px-6 border-t border-border">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 sm:flex-none"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1 sm:flex-none">
          {isPending ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
}
