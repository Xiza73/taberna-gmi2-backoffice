import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { formatPEN } from '@/utils/format';

/**
 * Recharts inyecta `active`, `payload`, `label`, etc. en runtime vía
 * `cloneElement` cuando le pasamos `<Tooltip content={<ChartTooltip ... />} />`.
 * Por eso esas props son opcionales acá: el caller sólo pasa nuestras
 * extensiones (`currency`, `suffix`).
 */
type Props = Partial<TooltipProps<ValueType, NameType>> & {
  /** Si `currency` es true, formatea el value como `formatPEN`. */
  currency?: boolean;
  /** Sufijo opcional para valores que no son moneda (ej. "unidades"). */
  suffix?: string;
};

/**
 * Tooltip oscuro reutilizable para los charts del feature pos-reports.
 * Muestra el label (eje X o Y según orientación) y el value formateado.
 */
export function ChartTooltip({ active, payload, label, currency, suffix }: Props) {
  if (!active || !payload || payload.length === 0) return null;
  const first = payload[0];
  const raw = first?.value;
  const formatted = formatValue(raw, currency, suffix);

  return (
    <div className="rounded-md border border-border bg-card px-2.5 py-2 text-xs shadow-md">
      {label !== undefined && label !== '' && (
        <p className="text-muted-foreground mb-0.5">{String(label)}</p>
      )}
      <p className="text-foreground tabular-nums font-semibold">{formatted}</p>
    </div>
  );
}

function formatValue(
  raw: unknown,
  currency: boolean | undefined,
  suffix: string | undefined,
): string {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return '—';
  if (currency) return formatPEN(raw);
  const base = new Intl.NumberFormat('es-PE').format(raw);
  return suffix ? `${base} ${suffix}` : base;
}
