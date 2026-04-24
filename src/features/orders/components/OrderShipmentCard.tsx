import { useState } from 'react';
import { CheckCircle2, ExternalLink, Pencil, Plus, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { formatDateTime } from '@/utils/format';
import type { OrderStatus } from '@/types/orders';
import type { ShipmentStatus } from '@/types/shipments';
import { carrierLabels } from '../lib/carrier';
import { useShipment } from '../hooks/useShipment';
import { useUpdateShipment } from '../hooks/useShipmentMutations';
import { ShipmentFormModal } from './ShipmentFormModal';

interface Props {
  orderId: string;
  orderStatus: OrderStatus;
}

const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  shipped: 'Despachado',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
};

const shipmentStatusBadgeClass: Record<ShipmentStatus, string> = {
  shipped: 'bg-cyan-500/10 text-cyan-400',
  in_transit: 'bg-primary/10 text-primary',
  delivered: 'bg-emerald-500/10 text-emerald-400',
};

const ALLOWS_REGISTER: OrderStatus[] = ['paid', 'processing'];

export function OrderShipmentCard({ orderId, orderStatus }: Props) {
  const shipmentQuery = useShipment(orderId);
  const updateMutation = useUpdateShipment(orderId);
  const [showForm, setShowForm] = useState(false);

  const isLoading = shipmentQuery.isLoading;
  const isNotFound =
    shipmentQuery.isError &&
    shipmentQuery.error instanceof ApiError &&
    shipmentQuery.error.code === 'NOT_FOUND';
  const isOtherError =
    shipmentQuery.isError && !isNotFound;
  const shipment = shipmentQuery.data;

  const canRegister = ALLOWS_REGISTER.includes(orderStatus);
  const canMarkDelivered = shipment && shipment.status !== 'delivered';

  const handleMarkDelivered = async () => {
    try {
      await updateMutation.mutateAsync({ status: 'delivered' });
      toast.success('Envío marcado como entregado');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo actualizar';
      toast.error(message);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm text-muted-foreground">Envío</h3>
        {shipment && (
          <span
            className={cn(
              'inline-flex items-center text-xs px-2 py-0.5 rounded',
              shipmentStatusBadgeClass[shipment.status],
            )}
          >
            {shipmentStatusLabels[shipment.status]}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-12 rounded bg-muted/40 animate-pulse" />
      ) : isOtherError ? (
        <p className="text-sm text-destructive">
          {shipmentQuery.error instanceof Error
            ? shipmentQuery.error.message
            : 'No se pudo cargar el envío'}
        </p>
      ) : shipment ? (
        <>
          <dl className="space-y-2 text-sm">
            <Row label="Transportista" value={carrierLabels[shipment.carrier]} />
            <Row
              label="Tracking"
              value={
                <span className="font-mono text-xs">{shipment.trackingNumber}</span>
              }
            />
            {shipment.trackingUrl && (
              <Row
                label=""
                value={
                  <a
                    href={shipment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                  >
                    Seguir envío
                    <ExternalLink size={12} />
                  </a>
                }
              />
            )}
            {shipment.shippedAt && (
              <Row
                label="Despachado"
                value={
                  <span className="tabular-nums text-xs">
                    {formatDateTime(shipment.shippedAt)}
                  </span>
                }
              />
            )}
            {shipment.deliveredAt && (
              <Row
                label="Entregado"
                value={
                  <span className="tabular-nums text-xs">
                    {formatDateTime(shipment.deliveredAt)}
                  </span>
                }
              />
            )}
            {shipment.notes && (
              <div className="pt-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Notas
                </p>
                <p className="text-xs whitespace-pre-wrap">{shipment.notes}</p>
              </div>
            )}
          </dl>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {canMarkDelivered && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => void handleMarkDelivered()}
                disabled={updateMutation.isPending}
              >
                <CheckCircle2 size={14} />
                <span>Marcar entregado</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(true)}
              disabled={updateMutation.isPending}
            >
              <Pencil size={14} />
              <span>Editar</span>
            </Button>
          </div>
        </>
      ) : isNotFound && canRegister ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Este pedido todavía no tiene envío registrado.
          </p>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={14} />
            <span>Registrar envío</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck size={16} />
          <span>Sin envío registrado.</span>
        </div>
      )}

      <ShipmentFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        orderId={orderId}
        shipment={shipment}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
