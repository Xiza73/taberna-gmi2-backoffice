import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import type { StaffSalesReportItem } from '@/types/posReports';
import { cn } from '@/utils/cn';
import { daysAgoIso, isValidIsoRange, todayIso } from '@/utils/date';
import { formatInteger, formatPEN } from '@/utils/format';
import { useStaffSalesReport } from '../hooks/useStaffSalesReport';
import { CHART_PRIMARY_COLOR, tickFormatterCents } from '../lib/chartFormatters';
import { ChartTooltip } from './ChartTooltip';
import { RangeFilters } from './RangeFilters';

const AXIS_TICK = { fontSize: 11, fill: 'currentColor' };
const RANGE_INVALID_ERROR =
  'El rango es inválido: la fecha "Desde" debe ser anterior o igual a la fecha "Hasta".';
const DEFAULT_RANGE = { dateFrom: daysAgoIso(6), dateTo: todayIso() };

interface Props {
  /** Solo true si el usuario es super_admin (controlado por el page). */
  enabled: boolean;
}

/**
 * Reporte de ventas por vendedor. La habilitación de la query depende
 * del rol (super_admin) Y del rango válido — el page pasa `enabled`
 * según el rol y este componente combina con la validación de rango.
 */
export function StaffSalesReport({ enabled }: Props) {
  const [range, setRange] = useState(DEFAULT_RANGE);
  const isValid = isValidIsoRange(range.dateFrom, range.dateTo);
  const { data, isLoading, isFetching, isError } = useStaffSalesReport(
    range.dateFrom,
    range.dateTo,
    enabled && isValid,
  );

  const showSkeleton = isLoading && !data && isValid && enabled;

  return (
    <div className="space-y-5">
      <RangeFilters
        dateFrom={range.dateFrom}
        dateTo={range.dateTo}
        onChange={setRange}
        error={isValid ? undefined : RANGE_INVALID_ERROR}
        disabled={isFetching}
      />

      {enabled && isValid && isFetching && !showSkeleton && (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 size={12} className="animate-spin" />
          Actualizando…
        </span>
      )}

      {!enabled || !isValid ? null : isError ? (
        <ErrorBox />
      ) : showSkeleton ? (
        <RangeSkeleton />
      ) : data ? (
        <Body dateFrom={data.dateFrom} dateTo={data.dateTo} items={data.items} />
      ) : null}
    </div>
  );
}

interface BodyProps {
  dateFrom: string;
  dateTo: string;
  items: StaffSalesReportItem[];
}

function Body({ dateFrom, dateTo, items }: BodyProps) {
  // Layout vertical: invertimos para que el top ranking quede arriba.
  const chartData = useMemo(() => [...items].reverse(), [items]);

  const totals = useMemo(() => {
    let count = 0;
    let amount = 0;
    for (const item of items) {
      count += item.count;
      amount += item.totalAmount;
    }
    return { count, amount };
  }, [items]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Rango: <span className="tabular-nums text-foreground">{dateFrom}</span>
        {' → '}
        <span className="tabular-nums text-foreground">{dateTo}</span>
      </p>

      {items.length === 0 ? (
        <EmptyBox text="Sin ventas para el rango seleccionado." />
      ) : (
        <>
          <div className="rounded-lg border border-border bg-card/30 p-3">
            <ResponsiveContainer
              width="100%"
              height={Math.max(200, items.length * 38 + 40)}
            >
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-border/40"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tickFormatterCents}
                  className="text-muted-foreground"
                />
                <YAxis
                  type="category"
                  dataKey="staffName"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  width={140}
                  className="text-muted-foreground"
                />
                <Tooltip
                  cursor={{ fill: 'currentColor', fillOpacity: 0.08 }}
                  content={<ChartTooltip currency />}
                />
                <Bar
                  dataKey="totalAmount"
                  fill={CHART_PRIMARY_COLOR}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="text-left px-3 py-2 font-medium">Vendedor</th>
                  <th className="text-right px-3 py-2 w-24 font-medium">Cant.</th>
                  <th className="text-right px-3 py-2 w-32 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.map((item) => (
                  <tr key={item.staffId}>
                    <td className="px-3 py-2 text-foreground">{item.staffName}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium">
                      {formatInteger(item.count)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium">
                      {formatPEN(item.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30 border-t border-border">
                <tr>
                  <td
                    className={cn(
                      'px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground font-medium',
                    )}
                  >
                    Totales
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-foreground font-semibold">
                    {formatInteger(totals.count)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-foreground font-semibold">
                    {formatPEN(totals.amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ErrorBox() {
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive flex items-center gap-2"
    >
      <AlertTriangle size={16} />
      No se pudo cargar el reporte. Intenta de nuevo en unos segundos.
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border py-10 px-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
      <Inbox size={20} className="text-muted-foreground/60" />
      {text}
    </div>
  );
}

function RangeSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-64 rounded-lg border border-border bg-card/50" />
      <div className="h-40 rounded-lg border border-border bg-card/50" />
    </div>
  );
}
