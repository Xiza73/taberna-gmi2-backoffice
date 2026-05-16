import { cn } from '@/utils/cn';

export type PosReportTab = 'daily' | 'paymentMethod' | 'staff';

interface Tab {
  id: PosReportTab;
  label: string;
}

const ALL_TABS: Tab[] = [
  { id: 'daily', label: 'Diario' },
  { id: 'paymentMethod', label: 'Por método de pago' },
  { id: 'staff', label: 'Por vendedor' },
];

interface Props {
  active: PosReportTab;
  onChange: (next: PosReportTab) => void;
  /** Si false, el tab "Por vendedor" no se renderiza (solo super_admin). */
  showStaff: boolean;
}

const TAB_BASE =
  'px-3 py-1.5 rounded-md text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40';
const TAB_ACTIVE = 'bg-muted text-foreground';
const TAB_INACTIVE = 'text-muted-foreground hover:bg-muted/40 hover:text-foreground';

/**
 * Tab bar para Reportes POS. Botones simples (no Radix Tabs — no está
 * instalado en backoffice y este v0 no necesita aria-tabpanel/keyboard
 * nav extra, los buttons ya son accesibles).
 */
export function PosReportTabs({ active, onChange, showStaff }: Props) {
  const visible = showStaff ? ALL_TABS : ALL_TABS.filter((t) => t.id !== 'staff');

  return (
    <div
      role="tablist"
      aria-label="Tipos de reporte POS"
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card/40 p-1"
    >
      {visible.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(TAB_BASE, isActive ? TAB_ACTIVE : TAB_INACTIVE)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
