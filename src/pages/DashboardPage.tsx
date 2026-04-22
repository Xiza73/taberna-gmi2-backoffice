export function DashboardPage() {
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
        <div className="flex items-center justify-center h-64 rounded-lg border border-border bg-card/50">
          <p className="text-muted-foreground">
            Dashboard en construcción — conectar con el backend
          </p>
        </div>
      </div>
    </div>
  );
}
