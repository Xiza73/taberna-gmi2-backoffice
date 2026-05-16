import { DateRangePicker } from '@/features/reports/components/DateRangePicker';
import { todayIso } from '@/utils/date';

interface Props {
  dateFrom: string;
  dateTo: string;
  onChange: (next: { dateFrom: string; dateTo: string }) => void;
  /** Mensaje de error inline (ej. rango inválido). Si presente, se muestra debajo. */
  error?: string;
  disabled?: boolean;
}

/**
 * Wrapper que reusa `DateRangePicker` del feature reports y agrega un
 * slot para mostrar errores de validación inline. Mantiene el estilo
 * visual del backoffice (no reescribe inputs).
 */
export function RangeFilters({ dateFrom, dateTo, onChange, error, disabled }: Props) {
  return (
    <div className="space-y-2">
      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={dateTo}
        maxDate={todayIso()}
        onChange={onChange}
        disabled={disabled}
      />
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
