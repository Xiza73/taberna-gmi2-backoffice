import {
  CalendarClock,
  CircleDollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import {
  OrdersByStatusChart,
  RecentOrdersTable,
  useDashboardSummary,
} from '@/features/dashboard';
import { formatInteger, formatPEN } from '@/utils/format';

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardSummary();

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Resumen general de tu ecommerce
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-sm text-destructive">
              No se pudo cargar el dashboard.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
        ) : data ? (
          <>
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Pedidos totales"
                value={formatInteger(data.totalOrders)}
                icon={ShoppingCart}
                delay={0}
              />
              <StatCard
                label="Ingresos totales"
                value={formatPEN(data.totalRevenue)}
                icon={CircleDollarSign}
                delay={0.05}
              />
              <StatCard
                label="Clientes"
                value={formatInteger(data.totalCustomers)}
                icon={Users}
                delay={0.1}
              />
              <StatCard
                label="Productos activos"
                value={formatInteger(data.totalProducts)}
                icon={Package}
                delay={0.15}
              />
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                label="Pedidos hoy"
                value={formatInteger(data.ordersToday)}
                icon={CalendarClock}
                delay={0.2}
              />
              <StatCard
                label="Ingresos hoy"
                value={formatPEN(data.revenueToday)}
                icon={TrendingUp}
                delay={0.25}
              />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <OrdersByStatusChart data={data.ordersByStatus} />
              <RecentOrdersTable orders={data.recentOrders} />
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-lg border border-border bg-card/50"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-lg border border-border bg-card/50"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 rounded-lg border border-border bg-card/50" />
        <div className="h-72 rounded-lg border border-border bg-card/50" />
      </div>
    </div>
  );
}
