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
import { AlertTriangle, CircleDollarSign, Inbox, Loader2, ShoppingCart } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import {
  orderStatusBadgeClass,
  orderStatusLabels,
} from '@/features/orders/lib/orderStatus';
import { paymentMethodLabels } from '@/features/orders/lib/paymentMethod';
import type { OrderStatus, PaymentMethod } from '@/types/orders';
import type {
  DailyReportPaymentMethodBreakdown,
  DailyReportStatusBreakdown,
  DailyReportTopProduct,
} from '@/types/posReports';
import { cn } from '@/utils/cn';
import { todayIso } from '@/utils/date';
import { formatInteger, formatPEN } from '@/utils/format';
import { useDailyPosReport } from '../hooks/useDailyPosReport';
import { CHART_PRIMARY_COLOR, tickFormatterCents } from '../lib/chartFormatters';
import { ChartTooltip } from './ChartTooltip';

const AXIS_TICK = { fontSize: 11, fill: 'currentColor' };

/**
 * Reporte del día: filtro por fecha + KPIs + 3 secciones (por método de
 * pago, por estado, top productos). Loading/error/empty manejados a
 * nivel componente.
 */
export function DailyReport() {
  const [date, setDate] = useState<string>(() => todayIso());
  const { data, isLoading, isFetching, isError } = useDailyPosReport(date);

  const showSkeleton = isLoading && !data;

  return (
    <div className="space-y-5">
      <div className="flex items-end gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground text-xs">Fecha</span>
          <input
            type="date"
            value={date}
            max={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            className="bg-input border border-border rounded-md px-2 py-1.5 text-sm text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
        </label>
        {isFetching && !showSkeleton && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground pb-2">
            <Loader2 size={12} className="animate-spin" />
            Actualizando…
          </span>
        )}
      </div>

      {isError ? (
        <ErrorBox />
      ) : showSkeleton ? (
        <DailySkeleton />
      ) : data ? (
        <DailyBody
          totalSales={data.totalSales}
          totalOrders={data.totalOrders}
          byPaymentMethod={data.byPaymentMethod}
          byStatus={data.byStatus}
          topProducts={data.topProducts}
        />
      ) : null}
    </div>
  );
}

interface BodyProps {
  totalSales: number;
  totalOrders: number;
  byPaymentMethod: DailyReportPaymentMethodBreakdown[];
  byStatus: DailyReportStatusBreakdown[];
  topProducts: DailyReportTopProduct[];
}

function DailyBody({
  totalSales,
  totalOrders,
  byPaymentMethod,
  byStatus,
  topProducts,
}: BodyProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total ventas"
          value={formatPEN(totalSales)}
          icon={CircleDollarSign}
        />
        <StatCard
          label="Total órdenes"
          value={formatInteger(totalOrders)}
          icon={ShoppingCart}
        />
      </div>

      <PaymentMethodSection items={byPaymentMethod} />
      <StatusSection items={byStatus} />
      <TopProductsSection items={topProducts} />
    </div>
  );
}

function PaymentMethodSection({ items }: { items: DailyReportPaymentMethodBreakdown[] }) {
  const chartData = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        label: paymentLabel(item.paymentMethod),
      })),
    [items],
  );

  return (
    <section className="space-y-3">
      <SectionTitle>Por método de pago</SectionTitle>
      {items.length === 0 ? (
        <EmptySection text="Sin datos para este día." />
      ) : (
        <>
          <div className="rounded-lg border border-border bg-card/30 p-3">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-border/40"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tickFormatterCents}
                  width={70}
                  className="text-muted-foreground"
                />
                <Tooltip
                  cursor={{ fill: 'currentColor', fillOpacity: 0.08 }}
                  content={<ChartTooltip currency />}
                />
                <Bar dataKey="total" fill={CHART_PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <SimpleTable
            headers={['Método', 'Cant.', 'Total']}
            rows={items.map((item) => [
              paymentLabel(item.paymentMethod),
              formatInteger(item.count),
              formatPEN(item.total),
            ])}
            alignRight={[false, true, true]}
          />
        </>
      )}
    </section>
  );
}

function StatusSection({ items }: { items: DailyReportStatusBreakdown[] }) {
  return (
    <section className="space-y-3">
      <SectionTitle>Por estado</SectionTitle>
      {items.length === 0 ? (
        <EmptySection text="Sin datos para este día." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const knownStatus = item.status as OrderStatus;
            const label = orderStatusLabels[knownStatus] ?? humanizeRaw(item.status);
            const badge =
              orderStatusBadgeClass[knownStatus] ?? 'bg-muted text-muted-foreground';
            return (
              <span
                key={item.status}
                className={cn(
                  'inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs',
                  badge,
                )}
              >
                <span className="uppercase tracking-wide">{label}</span>
                <span className="tabular-nums bg-background/40 px-1.5 py-0.5 rounded font-semibold">
                  {formatInteger(item.count)}
                </span>
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TopProductsSection({ items }: { items: DailyReportTopProduct[] }) {
  // Recharts en layout vertical pinta de abajo hacia arriba: invertimos
  // el dataset para que el más vendido quede arriba a simple vista.
  const chartData = useMemo(() => [...items].reverse(), [items]);

  return (
    <section className="space-y-3">
      <SectionTitle>Top productos</SectionTitle>
      {items.length === 0 ? (
        <EmptySection text="Sin productos vendidos este día." />
      ) : (
        <>
          <div className="rounded-lg border border-border bg-card/30 p-3">
            <ResponsiveContainer
              width="100%"
              height={Math.max(180, items.length * 36 + 40)}
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
                  allowDecimals={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  type="category"
                  dataKey="productName"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  width={140}
                  className="text-muted-foreground"
                />
                <Tooltip
                  cursor={{ fill: 'currentColor', fillOpacity: 0.08 }}
                  content={<ChartTooltip suffix="unidades" />}
                />
                <Bar dataKey="quantity" fill={CHART_PRIMARY_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <SimpleTable
            headers={['Producto', 'Cant.', 'Total']}
            rows={items.map((item) => [
              item.productName,
              formatInteger(item.quantity),
              formatPEN(item.total),
            ])}
            alignRight={[false, true, true]}
          />
        </>
      )}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
      {children}
    </h3>
  );
}

function EmptySection({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border py-6 px-4 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
      <Inbox size={18} className="text-muted-foreground/60" />
      {text}
    </div>
  );
}

interface SimpleTableProps {
  headers: string[];
  rows: string[][];
  alignRight: boolean[];
}

function SimpleTable({ headers, rows, alignRight }: SimpleTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="text-xs uppercase tracking-wide text-muted-foreground">
            {headers.map((h, i) => (
              <th
                key={h}
                className={cn(
                  'px-3 py-2 font-medium',
                  alignRight[i] ? 'text-right' : 'text-left',
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    'px-3 py-2',
                    alignRight[ci]
                      ? 'text-right tabular-nums font-medium'
                      : 'text-foreground',
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DailySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-28 rounded-lg border border-border bg-card/50" />
        ))}
      </div>
      <div className="h-64 rounded-lg border border-border bg-card/50 animate-pulse" />
      <div className="h-32 rounded-lg border border-border bg-card/50 animate-pulse" />
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

function paymentLabel(raw: string): string {
  const known = paymentMethodLabels[raw as PaymentMethod];
  return known ?? humanizeRaw(raw);
}

function humanizeRaw(raw: string): string {
  return raw.charAt(0).toUpperCase() + raw.slice(1).replace(/_/g, ' ');
}
