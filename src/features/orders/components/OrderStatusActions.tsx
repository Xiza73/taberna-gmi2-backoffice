import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { OrderStatus } from '@/types/orders';
import { useUpdateOrderStatus } from '../hooks/useOrderMutations';

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusActions({ orderId, currentStatus }: Props) {
  const updateMutation = useUpdateOrderStatus(orderId);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  const transitionTo = async (next: OrderStatus, successMessage: string) => {
    try {
      await updateMutation.mutateAsync({ status: next });
      toast.success(successMessage);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo cambiar el estado';
      toast.error(message);
    }
  };

  const handleRefundConfirm = async () => {
    setShowRefundConfirm(false);
    await transitionTo('refunded', 'Pedido marcado como reembolsado');
  };

  const showProcessing = currentStatus === 'paid';
  const showRefund = currentStatus === 'paid' || currentStatus === 'processing';

  if (!showProcessing && !showRefund) return null;

  const isPending = updateMutation.isPending;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {showProcessing && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void transitionTo('processing', 'Pedido en preparación')}
            disabled={isPending}
          >
            <ArrowRight size={14} />
            <span>Mover a procesando</span>
          </Button>
        )}
        {showRefund && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowRefundConfirm(true)}
            disabled={isPending}
          >
            <RotateCcw size={14} />
            <span>Marcar como reembolsada</span>
          </Button>
        )}
      </div>

      <ConfirmDialog
        isOpen={showRefundConfirm}
        onClose={() => setShowRefundConfirm(false)}
        onConfirm={() => void handleRefundConfirm()}
        title="Marcar como reembolsada"
        message="Esto SÓLO cambia el estado a 'reembolsada'. NO restaura stock ni llama a MercadoPago. El reembolso del dinero al cliente se procesa manualmente desde el panel de MercadoPago. ¿Continuar?"
      />
    </>
  );
}
