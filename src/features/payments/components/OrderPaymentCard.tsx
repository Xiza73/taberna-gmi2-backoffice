import { CreditCard, Info } from 'lucide-react';
import { ApiError } from '@/api/errors';
import { cn } from '@/utils/cn';
import { formatDateTime, formatPEN } from '@/utils/format';
import {
  paymentMethodLabels,
} from '@/features/orders';
import type { PaymentMethod } from '@/types/orders';
import { usePayment } from '../hooks/usePayment';
import {
  paymentStatusBadgeClass,
  paymentStatusLabels,
} from '../lib/paymentStatus';

interface Props {
  orderId: string;
  paymentMethod: PaymentMethod;
}

export function OrderPaymentCard({ orderId, paymentMethod }: Props) {
  const paymentQuery = usePayment(orderId);

  const isLoading = paymentQuery.isLoading;
  const isNotFound =
    paymentQuery.isError &&
    paymentQuery.error instanceof ApiError &&
    paymentQuery.error.code === 'NOT_FOUND';
  const isOtherError = paymentQuery.isError && !isNotFound;
  const payment = paymentQuery.data;

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm text-muted-foreground">Pago</h3>
        {payment && (
          <span
            className={cn(
              'inline-flex items-center text-xs px-2 py-0.5 rounded',
              paymentStatusBadgeClass[payment.status],
            )}
          >
            {paymentStatusLabels[payment.status]}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-12 rounded bg-muted/40 animate-pulse" />
      ) : isOtherError ? (
        <p className="text-sm text-destructive">
          {paymentQuery.error instanceof Error
            ? paymentQuery.error.message
            : 'No se pudo cargar el pago'}
        </p>
      ) : payment ? (
        <dl className="space-y-2 text-sm">
          <Row label="Método" value={paymentMethodLabels[paymentMethod]} />
          <Row
            label="Monto"
            value={
              <span className="tabular-nums font-medium">
                {formatPEN(payment.amount)}
              </span>
            }
          />
          {payment.method && payment.method !== paymentMethod && (
            <Row
              label="Detalle"
              value={<span className="text-xs">{payment.method}</span>}
            />
          )}
          {payment.externalId && (
            <Row
              label="ID externo"
              value={
                <span className="font-mono text-xs">{payment.externalId}</span>
              }
            />
          )}
          {payment.preferenceId && (
            <Row
              label="Preferencia"
              value={
                <span className="font-mono text-xs truncate max-w-[140px] inline-block">
                  {payment.preferenceId}
                </span>
              }
            />
          )}
          {payment.paidAt && (
            <Row
              label="Pagado"
              value={
                <span className="tabular-nums text-xs">
                  {formatDateTime(payment.paidAt)}
                </span>
              }
            />
          )}
        </dl>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard size={16} />
            <span>Método: {paymentMethodLabels[paymentMethod]}</span>
          </div>
          {paymentMethod !== 'mercadopago' && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded p-2">
              <Info size={12} className="mt-0.5 shrink-0" />
              <span>
                Pago manual. Verifica el comprobante y marca la orden como
                pagada desde "Cambiar estado".
              </span>
            </div>
          )}
          {paymentMethod === 'mercadopago' && isNotFound && (
            <p className="text-xs text-muted-foreground italic">
              Sin transacción registrada todavía.
            </p>
          )}
        </div>
      )}
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
