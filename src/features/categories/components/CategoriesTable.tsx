import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/utils/cn';
import type { Category } from '@/types/categories';

interface Props {
  categories: Category[];
  parentLookup: Map<string, string>;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  parentLookup,
  onEdit,
  onDelete,
}: Props) {
  if (categories.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No hay categorías para mostrar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Padre</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Orden</TableHead>
          <TableHead className="text-right w-[120px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {category.slug}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {category.parentId
                ? parentLookup.get(category.parentId) ?? '—'
                : '—'}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  'inline-flex items-center text-xs px-2 py-0.5 rounded',
                  category.isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {category.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {category.sortOrder}
            </TableCell>
            <TableCell className="text-right">
              <div className="inline-flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(category)}
                  className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Editar ${category.name}`}
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(category)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Eliminar ${category.name}`}
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
