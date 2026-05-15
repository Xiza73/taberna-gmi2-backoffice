import { formatPEN } from '@/utils/format';
import type { CashRegister } from '@/types/cashRegisters';
import { cn } from '@/utils/cn';

interface Props {
  register: CashRegister;
}

/** Umbral en centavos para resaltar diferencias significativas. */
const DIFFERENCE_HIGHLIGHT_CENTS = 1000;

export function CashRegisterBreakdownCard({ register }: Props) {
  const isClosed = register.status === 'closed';
  const diff = register.difference;
  const highlightDiff = diff !== null && Math.abs(diff) > DIFFERENCE_HIGHLIGHT_CENTS;

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5">
      <h3 className="text-sm text-muted-foreground mb-4">Arqueo</h3>

      <dl className="space-y-2 text-sm">
        <Row
          label="Monto inicial"
          value={formatPEN(register.initialAmount)}
        />
        <Row
          label="Ventas en efectivo"
          value={formatPEN(register.cashSalesAmount)}
        />
        <Row
          label="Ingresos a caja"
          value={formatPEN(register.cashInAmount)}
          valueClass="text-emerald-400"
        />
        <Row
          label="Egresos de caja"
          value={`- ${formatPEN(register.cashOutAmount)}`}
          valueClass="text-destructive"
        />

        <div className="pt-2 mt-2 border-t border-border">
          <Row
            label="Esperado"
            value={
              register.expectedAmount === null
                ? '—'
                : formatPEN(register.expectedAmount)
            }
            labelClass="text-foreground"
            valueClass="text-foreground font-medium"
          />
        </div>

        {isClosed && (
          <>
            <Row
              label="Contado al cierre"
              value={
                register.closingAmount === null
                  ? '—'
                  : formatPEN(register.closingAmount)
              }
              labelClass="text-foreground"
              valueClass="text-foreground font-medium"
            />

            <div
              className={cn(
                'pt-3 mt-2 border-t border-border rounded-md -mx-2 px-2 py-2',
                highlightDiff && 'bg-amber-500/5',
              )}
            >
              <Row
                label="Diferencia"
                value={
                  diff === null
                    ? '—'
                    : `${diff > 0 ? '+' : ''}${formatPEN(diff)}`
                }
                labelClass={
                  highlightDiff
                    ? 'text-amber-400 font-medium'
                    : 'text-foreground'
                }
                valueClass={cn(
                  'text-base font-medium',
                  diff === null && 'text-muted-foreground',
                  diff !== null && diff > 0 && 'text-emerald-400',
                  diff !== null && diff < 0 && 'text-destructive',
                  diff === 0 && 'text-foreground',
                )}
              />
              {highlightDiff && (
                <p className="text-xs text-amber-400/80 mt-1">
                  Diferencia significativa entre el monto contado y el
                  esperado.
                </p>
              )}
            </div>
          </>
        )}
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
