import { ShieldOff } from 'lucide-react';
import { useAuth } from '@/features/auth';
import {
  SalesReportSection,
  TopProductsSection,
} from '@/features/reports';

export function ReportsPage() {
  const { me, isLoading } = useAuth();
  const canViewReports =
    me?.role === 'super_admin' || me?.role === 'admin';

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Reportes</h2>
          <p className="text-sm text-muted-foreground">
            Análisis de ventas y productos más vendidos.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-6xl">
        {isLoading ? (
          <ReportsSkeleton />
        ) : !me ? null : !canViewReports ? (
          <NoAccess />
        ) : (
          <>
            <SalesReportSection />
            <TopProductsSection />
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
        Los reportes están disponibles solo para administradores.
      </p>
    </div>
  );
}

function ReportsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-96 rounded-lg border border-border bg-card/50" />
      <div className="h-72 rounded-lg border border-border bg-card/50" />
    </div>
  );
}
