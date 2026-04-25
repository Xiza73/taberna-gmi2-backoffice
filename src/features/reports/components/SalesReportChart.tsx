import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SalesReportItem } from '@/types/reports';
import { formatPEN } from '@/utils/format';
import { formatShortDate } from '@/utils/date';

interface Props {
  items: SalesReportItem[];
}

const REVENUE_COLOR = '#00d9a3';
const ORDERS_COLOR = '#3b82f6';

interface ChartDatum {
  date: string;
  label: string;
  revenue: number;
  revenueDisplay: number;
  orders: number;
}

export function SalesReportChart({ items }: Props) {
  const chartData: ChartDatum[] = items.map((i) => ({
    date: i.date,
    label: formatShortDate(i.date),
    revenue: i.revenue,
    revenueDisplay: i.revenue / 100,
    orders: i.orders,
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={REVENUE_COLOR} stopOpacity={0.4} />
              <stop offset="100%" stopColor={REVENUE_COLOR} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ORDERS_COLOR} stopOpacity={0.3} />
              <stop offset="100%" stopColor={ORDERS_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-border/40"
          />
          <XAxis
            dataKey="label"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground"
          />
          <YAxis
            yAxisId="revenue"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground"
            tickFormatter={(v: number) =>
              v >= 1000 ? `S/${(v / 1000).toFixed(1)}k` : `S/${v.toFixed(0)}`
            }
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground"
          />
          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number, name) => {
              if (name === 'Ingresos') {
                return [formatPEN(Math.round(value * 100)), 'Ingresos'];
              }
              return [value, 'Pedidos'];
            }}
          />
          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="revenueDisplay"
            stroke={REVENUE_COLOR}
            strokeWidth={2}
            fill="url(#revenueGradient)"
            name="Ingresos"
          />
          <Area
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            stroke={ORDERS_COLOR}
            strokeWidth={2}
            fill="url(#ordersGradient)"
            name="Pedidos"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
