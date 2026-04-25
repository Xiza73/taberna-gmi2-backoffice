import { Calendar } from 'lucide-react';

interface Props {
  dateFrom: string;
  dateTo: string;
  onChange: (next: { dateFrom: string; dateTo: string }) => void;
  /** Optional ISO date for max selectable date. Defaults to today (browser-side). */
  maxDate?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onChange,
  maxDate,
  disabled = false,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <label className="flex items-center gap-2 text-sm">
        <Calendar size={16} className="text-muted-foreground" />
        <span className="text-muted-foreground">Desde</span>
        <input
          type="date"
          value={dateFrom}
          max={dateTo || maxDate}
          disabled={disabled}
          onChange={(e) => onChange({ dateFrom: e.target.value, dateTo })}
          className="bg-input border border-border rounded-md px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Hasta</span>
        <input
          type="date"
          value={dateTo}
          min={dateFrom}
          max={maxDate}
          disabled={disabled}
          onChange={(e) => onChange({ dateFrom, dateTo: e.target.value })}
          className="bg-input border border-border rounded-md px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        />
      </label>
    </div>
  );
}
