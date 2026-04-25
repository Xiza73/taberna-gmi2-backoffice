import { useState } from 'react';
import { CircleDollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { useSalesReport } from '@/features/reports/hooks/useReports';
import { StatCard } from '@/components/ui/StatCard';
import {
  daysAgoIso,
  formatShortDate,
  isValidIsoRange,
  todayIso,
} from '@/utils/date';
import { formatInteger, formatPEN } from '@/utils/format';
import { DateRangePicker } from './DateRangePicker';
import { SalesReportChart } from './SalesReportChart';

const DEFAULT_RANGE = {
  dateFrom: daysAgoIso(29),
  dateTo: todayIso(),
};

export function SalesReportSection() {
  const [range, setRange] = useState(DEFAULT_RANGE);
  const isValid = isValidIsoRange(range.dateFrom, range.dateTo);

  const { data, isLoading, isFetching, isError, error } = useSalesReport(range, {
    enabled: isValid,
  });

  return (
    <section className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base mb-1">Reporte de ventas</h3>
          <p className="text-xs text-muted-foreground">
            Solo cuenta pedidos en estado pagado, en proceso, enviado o entregado.
          </p>
        </div>
        <DateRangePicker
          dateFrom={range.dateFrom}
          dateTo={range.dateTo}
          maxDate={todayIso()}
          onChange={setRange}
          disabled={isFetching}
        />
      </header>

      {!isValid ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          El rango de fechas es inválido. Asegurate que la fecha desde sea menor o
          igual a la fecha hasta.
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            No se pudo cargar el reporte de ventas.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      ) : isLoading || !data ? (
        <SalesSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label={`Ingresos (${formatShortDate(range.dateFrom)} – ${formatShortDate(range.dateTo)})`}
              value={formatPEN(data.totalRevenue)}
              icon={CircleDollarSign}
            />
            <StatCard
              label="Pedidos en el período"
              value={formatInteger(data.totalOrders)}
              icon={ShoppingCart}
            />
            <StatCard
              label="Ticket promedio"
              value={
                data.totalOrders > 0
                  ? formatPEN(Math.round(data.totalRevenue / data.totalOrders))
                  : formatPEN(0)
              }
              icon={TrendingUp}
            />
          </div>

          {data.items.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              No hay ventas registradas en este período.
            </div>
          ) : (
            <SalesReportChart items={data.items} />
          )}
        </>
      )}
    </section>
  );
}

function SalesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-lg border border-border bg-card/50"
          />
        ))}
      </div>
      <div className="h-72 rounded-lg border border-border bg-card/50" />
    </div>
  );
}
