import { useState } from 'react';
import { ImageOff, Pencil, Star, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/utils/cn';
import { formatInteger, formatPEN } from '@/utils/format';
import type { Product } from '@/types/products';

interface Props {
  products: Product[];
  categoryLookup: Map<string, string>;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({
  products,
  categoryLookup,
  onEdit,
  onDelete,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No hay productos para mostrar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]"></TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-right">Precio</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right w-[120px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <ProductThumb url={product.images[0]} alt={product.name} />
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex flex-col">
                <span>{product.name}</span>
                {product.totalReviews > 0 && product.averageRating !== null && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {product.averageRating.toFixed(1)} · {product.totalReviews} reseñas
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {product.sku ?? '—'}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {categoryLookup.get(product.categoryId) ?? '—'}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              <div className="flex flex-col items-end">
                <span>{formatPEN(product.price)}</span>
                {product.compareAtPrice !== null && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPEN(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              <span
                className={cn(
                  product.stock === 0 && 'text-destructive',
                  product.stock > 0 && product.stock < 10 && 'text-amber-400',
                )}
              >
                {formatInteger(product.stock)}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  'inline-flex items-center text-xs px-2 py-0.5 rounded',
                  product.isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {product.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="inline-flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Editar ${product.name}`}
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Eliminar ${product.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ProductThumb({ url, alt }: { url: string | undefined; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (!url || errored) {
    return (
      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
        <ImageOff size={14} />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      width={40}
      height={40}
      loading="lazy"
      onError={() => setErrored(true)}
      className="w-10 h-10 rounded-md object-cover bg-muted"
    />
  );
}
