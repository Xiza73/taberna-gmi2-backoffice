import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { type ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onAddNew?: () => void;
  addButtonLabel?: string;
  filters?: ReactNode;
}

export function Header({
  title,
  subtitle,
  searchPlaceholder = 'Buscar...',
  onSearch,
  onAddNew,
  addButtonLabel = 'Agregar',
  filters,
}: HeaderProps) {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      {/* Mobile layout */}
      <div className="lg:hidden pb-4">
        <div className="pt-6 pb-4 px-4 pl-16">
          <h2 className="text-xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {onSearch && (
          <div className="relative px-4 mb-3">
            <Search
              size={16}
              className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full h-[38px] pl-10 pr-4 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        )}

        <div className="flex gap-2 px-4">
          {onAddNew && (
            <Button onClick={onAddNew} size="md" className="flex-1">
              <Plus size={18} />
              {addButtonLabel}
            </Button>
          )}
          {filters && <div className="flex-shrink-0">{filters}</div>}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl mb-1">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            {onAddNew && (
              <Button onClick={onAddNew} size="md">
                <Plus size={18} />
                {addButtonLabel}
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {onSearch && (
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full h-[38px] pl-10 pr-4 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
            )}

            {filters}
          </div>
        </div>
      </div>
    </div>
  );
}
