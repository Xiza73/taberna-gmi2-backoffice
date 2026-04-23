import type { Order } from '@/types/orders';

interface Props {
  order: Order;
}

export function OrderNotesCard({ order }: Props) {
  const hasCustomerNotes = Boolean(order.notes?.trim());
  const hasAdminNotes = Boolean(order.adminNotes?.trim());

  if (!hasCustomerNotes && !hasAdminNotes) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-4">
      <h3 className="text-sm text-muted-foreground">Notas</h3>
      {hasCustomerNotes && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
            Cliente
          </p>
          <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
      {hasAdminNotes && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
            Internas
          </p>
          <p className="text-sm whitespace-pre-wrap">{order.adminNotes}</p>
        </div>
      )}
    </div>
  );
}
