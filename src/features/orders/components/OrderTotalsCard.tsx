import { formatPEN } from '@/utils/format';
import type { Order } from '@/types/orders';
import { shippingMethodLabels } from '../lib/shippingMethod';

interface Props {
  order: Order;
}

export function OrderTotalsCard({ order }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5">
      <h3 className="text-sm text-muted-foreground mb-4">Totales</h3>
      <dl className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatPEN(order.subtotal)} />
        {order.discount > 0 && (
          <Row
            label={
              order.couponCode
                ? `Descuento (${order.couponCode})`
                : 'Descuento'
            }
            value={`- ${formatPEN(order.discount)}`}
            valueClass="text-emerald-400"
          />
        )}
        <Row
          label={`Envío (${shippingMethodLabels[order.shippingMethod]})`}
          value={formatPEN(order.shippingCost)}
        />
        <div className="pt-2 mt-2 border-t border-border">
          <Row
            label="Total"
            value={formatPEN(order.total)}
            labelClass="text-foreground"
            valueClass="text-foreground text-base font-medium"
          />
        </div>
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  labelClass,
  valueClass,
}: {
  label: string;
  value: string;
  labelClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <dt className={labelClass ?? 'text-muted-foreground'}>{label}</dt>
      <dd className={`tabular-nums ${valueClass ?? ''}`}>{value}</dd>
    </div>
  );
}
