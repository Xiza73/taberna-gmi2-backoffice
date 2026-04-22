import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { OrdersByStatus } from '@/types/dashboard';
import {
  ORDER_STATUSES,
  orderStatusChartColor,
  orderStatusLabels,
} from '../lib/orderStatus';

interface Props {
  data: OrdersByStatus;
}

export function OrdersByStatusChart({ data }: Props) {
  const chartData = ORDER_STATUSES.map((status) => ({
    status,
    label: orderStatusLabels[status],
    count: data[status],
    fill: orderStatusChartColor[status],
  }));

  const totalAcrossStatuses = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm text-muted-foreground">Pedidos por estado</h3>
        <span className="text-xs text-muted-foreground">
          {totalAcrossStatuses} en total
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <XAxis
              dataKey="label"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'currentColor' }}
              className="text-muted-foreground"
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fill: 'currentColor' }}
              className="text-muted-foreground"
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [value, 'Pedidos']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
