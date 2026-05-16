import { formatPEN } from '@/utils/format';

/**
 * Color primario para todos los bars del feature pos-reports. Emerald-500
 * (#22c55e) — el mismo acento que se usa en cajas POS y en el chip
 * "Operaciones POS" del sidebar, para mantener lectura visual coherente.
 */
export const CHART_PRIMARY_COLOR = '#22c55e';

const CURRENCY_COMPACT = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 0,
});

/**
 * Centavos → "S/ 500" sin decimales. Para tick labels en ejes donde el
 * espacio es limitado (con decimales se pisa el siguiente tick).
 */
export function formatCentsCompact(cents: number): string {
  return CURRENCY_COMPACT.format(cents / 100);
}

/**
 * Acepta el `tickFormatter` callback de Recharts (que pasa `value` como
 * `number | string`). Devuelve la versión compacta o vacío si no es
 * número.
 */
export function tickFormatterCents(value: unknown): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '';
  return formatCentsCompact(value);
}

/** Wrapper para tick formatter que usa formatPEN (con decimales). */
export function tickFormatterCentsFull(value: unknown): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '';
  return formatPEN(value);
}
