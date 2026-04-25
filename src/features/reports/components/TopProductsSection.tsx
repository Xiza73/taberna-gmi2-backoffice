import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Trophy } from 'lucide-react';
import { useTopProducts } from '@/features/reports/hooks/useReports';
import { formatInteger, formatPEN } from '@/utils/format';

const LIMIT_OPTIONS = [5, 10, 20, 50] as const;
type LimitOption = (typeof LIMIT_OPTIONS)[number];
const DEFAULT_LIMIT: LimitOption = 10;

export function TopProductsSection() {
  const [limit, setLimit] = useState<LimitOption>(DEFAULT_LIMIT);
  const { data, isLoading, isError, error } = useTopProducts(limit);

  return (
    <section className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base mb-1">Productos más vendidos</h3>
          <p className="text-xs text-muted-foreground">
            Ranking histórico por unidades vendidas. Cuenta pedidos en estado
            pagado, en proceso, enviado o entregado.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Top</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value) as LimitOption)}
            className="bg-input border border-border rounded-md px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </header>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            No se pudo cargar el ranking de productos.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      ) : isLoading || !data ? (
        <TopProductsSkeleton />
      ) : data.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          Aún no hay ventas registradas.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium w-10">#</th>
                <th className="py-2 pr-4 font-medium">Producto</th>
                <th className="py-2 pr-4 font-medium text-right">Vendidos</th>
                <th className="py-2 pl-4 font-medium text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p, idx) => (
                <tr
                  key={p.productId}
                  className="border-b border-border/50 last:border-0 hover:bg-sidebar-accent/20"
                >
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {idx === 0 ? (
                      <Trophy size={14} className="text-amber-400 inline" />
                    ) : (
                      idx + 1
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <Link
                      to="/products/$productId/edit"
                      params={{ productId: p.productId }}
                      className="hover:text-primary transition-colors"
                    >
                      {p.productName}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">
                    {formatInteger(p.totalSold)}
                  </td>
                  <td className="py-2.5 pl-4 text-right tabular-nums">
                    {formatPEN(p.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function TopProductsSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 rounded-md bg-card/50 border border-border" />
      ))}
    </div>
  );
}
