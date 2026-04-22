const penFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat('es-PE');

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatPEN(cents: number): string {
  return penFormatter.format(cents / 100);
}

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

export function formatDateTime(iso: string): string {
  return dateFormatter.format(new Date(iso));
}
