import type { Order } from '@/types/orders';

interface Props {
  order: Order;
}

export function OrderNotesCard({ order }: Props) {
  if (!order.notes?.trim()) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-2">
      <h3 className="text-sm text-muted-foreground">Notas del cliente</h3>
      <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
    </div>
  );
}
