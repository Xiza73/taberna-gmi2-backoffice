import { useState } from 'react';
import { ShieldOff } from 'lucide-react';
import { useAuth } from '@/features/auth';
import {
  DailyReport,
  PaymentMethodReport,
  PosReportTabs,
  StaffSalesReport,
  type PosReportTab,
} from '@/features/pos-reports';

/**
 * Página de Reportes POS — único route con tabs:
 * Diario / Por método de pago / Por vendedor. El tab "Por vendedor" se
 * oculta para roles distintos a super_admin (el back devuelve 403 igual).
 */
export function PosReportsPage() {
  const { me, role, isLoading } = useAuth();
  const [tab, setTab] = useState<PosReportTab>('daily');
  const canViewPosReports = role === 'super_admin' || role === 'admin';
  const isSuperAdmin = role === 'super_admin';

  // Defensa extra: si el rol cambia a no-super_admin mientras el tab
  // staff está activo (caso raro), volvemos a daily para no dejar el
  // tab huérfano renderizándose deshabilitado.
  const effectiveTab: PosReportTab = tab === 'staff' && !isSuperAdmin ? 'daily' : tab;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Reportes POS</h2>
          <p className="text-sm text-muted-foreground">
            Resúmenes de ventas POS por día, método de pago y vendedor.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-6xl">
        {isLoading ? (
          <PosReportsSkeleton />
        ) : !me ? null : !canViewPosReports ? (
          <NoAccess />
        ) : (
          <>
            <PosReportTabs
              active={effectiveTab}
              onChange={setTab}
              showStaff={isSuperAdmin}
            />

            <section>
              {effectiveTab === 'daily' && <DailyReport />}
              {effectiveTab === 'paymentMethod' && <PaymentMethodReport />}
              {effectiveTab === 'staff' && <StaffSalesReport enabled={isSuperAdmin} />}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function NoAccess() {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <ShieldOff size={32} className="mx-auto text-muted-foreground mb-3" />
      <h3 className="text-base mb-1">Sin permisos</h3>
      <p className="text-sm text-muted-foreground">
        Los reportes POS están disponibles solo para administradores.
      </p>
    </div>
  );
}

function PosReportsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-72 rounded-lg border border-border bg-card/50" />
      <div className="h-96 rounded-lg border border-border bg-card/50" />
    </div>
  );
}
