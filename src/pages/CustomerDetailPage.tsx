import { useState } from 'react';
import {
  ArrowLeft,
  CircleSlash,
  CircleUserRound,
  Mail,
  Pencil,
  Phone,
  User,
} from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { cn } from '@/utils/cn';
import { formatDateTime } from '@/utils/format';
import {
  CustomerEditModal,
  CustomerOrdersList,
  useActivateCustomer,
  useCustomer,
  useSuspendCustomer,
} from '@/features/customers';

export function CustomerDetailPage() {
  const navigate = useNavigate();
  const { customerId } = useParams({ strict: false }) as { customerId?: string };
  const customerQuery = useCustomer(customerId);
  const suspendMutation = useSuspendCustomer();
  const activateMutation = useActivateCustomer();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmingToggle, setConfirmingToggle] = useState(false);

  const goBack = () => {
    void navigate({ to: '/customers' });
  };

  const customer = customerQuery.data;
  const isPending = suspendMutation.isPending || activateMutation.isPending;

  const confirmToggle = async () => {
    if (!customer) return;
    setConfirmingToggle(false);
    try {
      if (customer.isActive) {
        await suspendMutation.mutateAsync(customer.id);
        toast.success(`${customer.name} suspendido`);
      } else {
        await activateMutation.mutateAsync(customer.id);
        toast.success(`${customer.name} activado`);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo cambiar el estado';
      toast.error(message);
    }
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
            <h2 className="text-2xl lg:text-3xl mb-1 truncate">
              {customer ? customer.name : 'Cliente'}
            </h2>
            {customer && (
              <p className="text-sm text-muted-foreground">
                Registrado el {formatDateTime(customer.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {customerQuery.isLoading ? (
          <CustomerDetailSkeleton />
        ) : customerQuery.isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-sm text-destructive">No se pudo cargar el cliente.</p>
            <p className="text-xs text-muted-foreground mt-1">
              {customerQuery.error instanceof Error
                ? customerQuery.error.message
                : 'Error desconocido'}
            </p>
          </div>
        ) : customer && customerId ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <aside className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm text-muted-foreground">Perfil</h3>
                  <span
                    className={cn(
                      'inline-flex items-center text-xs px-2 py-0.5 rounded',
                      customer.isActive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-destructive/10 text-destructive',
                    )}
                  >
                    {customer.isActive ? 'Activo' : 'Suspendido'}
                  </span>
                </div>

                <dl className="space-y-2 text-sm">
                  <Row icon={<User size={14} />} value={customer.name} />
                  <Row icon={<Mail size={14} />} value={customer.email} />
                  <Row
                    icon={<Phone size={14} />}
                    value={customer.phone ?? <span className="text-muted-foreground">Sin teléfono</span>}
                  />
                </dl>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditOpen(true)}
                    disabled={isPending}
                  >
                    <Pencil size={14} />
                    <span>Editar</span>
                  </Button>
                  <Button
                    variant={customer.isActive ? 'destructive' : 'primary'}
                    size="sm"
                    onClick={() => setConfirmingToggle(true)}
                    disabled={isPending}
                  >
                    {customer.isActive ? (
                      <>
                        <CircleSlash size={14} />
                        <span>Suspender</span>
                      </>
                    ) : (
                      <>
                        <CircleUserRound size={14} />
                        <span>Activar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-2">
              <CustomerOrdersList customerId={customerId} />
            </div>
          </div>
        ) : null}
      </div>

      <CustomerEditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        customer={customer}
      />

      <ConfirmDialog
        isOpen={confirmingToggle}
        onClose={() => setConfirmingToggle(false)}
        onConfirm={() => void confirmToggle()}
        title={customer?.isActive ? 'Suspender cliente' : 'Activar cliente'}
        message={
          customer
            ? customer.isActive
              ? `¿Suspender a ${customer.name}? No podrá iniciar sesión ni hacer compras hasta que lo actives de nuevo.`
              : `¿Activar a ${customer.name}? Va a poder iniciar sesión inmediatamente.`
            : ''
        }
        confirmLabel={customer?.isActive ? 'Suspender' : 'Activar'}
        variant={customer?.isActive ? 'destructive' : 'primary'}
      />
    </div>
  );
}

function Row({ icon, value }: { icon: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function CustomerDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
      <aside className="space-y-4">
        <div className="h-64 rounded-lg border border-border bg-card/50" />
      </aside>
      <div className="lg:col-span-2 space-y-4">
        <div className="h-72 rounded-lg border border-border bg-card/50" />
      </div>
    </div>
  );
}
