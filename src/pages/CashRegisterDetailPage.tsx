import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  CashMovementsTable,
  CashRegisterBreakdownCard,
  CashRegisterDetailHeader,
  useCashRegister,
} from '@/features/cash-registers';

export function CashRegisterDetailPage() {
  const navigate = useNavigate();
  const { registerId } = useParams({ strict: false }) as {
    registerId?: string;
  };
  const registerQuery = useCashRegister(registerId);

  const goBack = () => {
    void navigate({ to: '/cash-registers' });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6 flex items-start gap-3">
          <button
            type="button"
            onClick={goBack}
            className="mt-1 p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl lg:text-3xl">Detalle de caja</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Apertura, arqueo y movimientos registrados durante el turno.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {registerQuery.isLoading ? (
          <CashRegisterDetailSkeleton />
        ) : registerQuery.isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-sm text-destructive">
              No se pudo cargar la caja.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {registerQuery.error instanceof Error
                ? registerQuery.error.message
                : 'Error desconocido'}
            </p>
          </div>
        ) : registerQuery.data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <CashRegisterDetailHeader register={registerQuery.data} />
              <CashMovementsTable
                movements={registerQuery.data.movements ?? []}
              />
              {registerQuery.data.notes?.trim() && (
                <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-2">
                  <h3 className="text-sm text-muted-foreground">
                    Notas del cierre
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {registerQuery.data.notes}
                  </p>
                </div>
              )}
            </div>
            <aside className="space-y-4">
              <CashRegisterBreakdownCard register={registerQuery.data} />
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CashRegisterDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-40 rounded-lg border border-border bg-card/50" />
        <div className="h-64 rounded-lg border border-border bg-card/50" />
      </div>
      <aside className="space-y-4">
        <div className="h-72 rounded-lg border border-border bg-card/50" />
      </aside>
    </div>
  );
}
