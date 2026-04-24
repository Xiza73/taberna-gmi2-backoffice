import { Mail, MapPin, Phone, User } from 'lucide-react';
import type { Order } from '@/types/orders';

interface Props {
  order: Order;
}

export function OrderCustomerCard({ order }: Props) {
  const addr = order.shippingAddressSnapshot ?? {};
  const street = (addr.street as string | undefined) ?? '';
  const district = (addr.district as string | undefined) ?? '';
  const city = (addr.city as string | undefined) ?? '';
  const department = (addr.department as string | undefined) ?? '';
  const reference = (addr.reference as string | undefined) ?? '';
  const recipientName = (addr.recipientName as string | undefined) ?? '';

  const hasAddress =
    street || district || city || department || reference || recipientName;

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-4">
      <h3 className="text-sm text-muted-foreground">Cliente</h3>

      <dl className="space-y-2 text-sm">
        <Row icon={<User size={14} />} value={order.customerName} />
        <Row icon={<Mail size={14} />} value={order.customerEmail} />
        {order.customerPhone && (
          <Row icon={<Phone size={14} />} value={order.customerPhone} />
        )}
      </dl>

      {hasAddress && (
        <>
          <hr className="border-border" />
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                {recipientName && <p>{recipientName}</p>}
                {street && <p className="text-muted-foreground">{street}</p>}
                {(district || city || department) && (
                  <p className="text-muted-foreground">
                    {[district, city, department].filter(Boolean).join(', ')}
                  </p>
                )}
                {reference && (
                  <p className="text-xs text-muted-foreground italic">{reference}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span>{value}</span>
    </div>
  );
}
