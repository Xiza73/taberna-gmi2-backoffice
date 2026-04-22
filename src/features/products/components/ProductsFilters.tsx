import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Category } from '@/types/categories';
import type { ProductSortBy } from '@/types/products';

interface Props {
  searchInput: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  sortBy: ProductSortBy;
  onSortChange: (value: ProductSortBy) => void;
  includeInactive: boolean;
  onIncludeInactiveChange: (value: boolean) => void;
  categories: Category[];
}

const sortOptions: { value: ProductSortBy; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'name', label: 'Nombre (A-Z)' },
  { value: 'price', label: 'Precio (menor a mayor)' },
  { value: 'price_desc', label: 'Precio (mayor a menor)' },
  { value: 'rating', label: 'Mejor calificados' },
];

export function ProductsFilters({
  searchInput,
  onSearchChange,
  categoryId,
  onCategoryChange,
  sortBy,
  onSortChange,
  includeInactive,
  onIncludeInactiveChange,
  categories,
}: Props) {
  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
      <div className="relative lg:col-span-2">
        <Search
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Buscar"
          placeholder="Nombre o SKU…"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        label="Categoría"
        options={categoryOptions}
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
      />

      <Select
        label="Ordenar por"
        options={sortOptions}
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as ProductSortBy)}
      />

      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer md:col-span-2 lg:col-span-4">
        <input
          type="checkbox"
          checked={includeInactive}
          onChange={(e) => onIncludeInactiveChange(e.target.checked)}
          className="w-4 h-4 rounded border-border bg-input-background"
        />
        Mostrar inactivos
      </label>
    </div>
  );
}
