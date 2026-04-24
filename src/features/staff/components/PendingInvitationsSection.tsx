import { useState } from 'react';
import { ChevronDown, ChevronRight, Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { cn } from '@/utils/cn';
import { formatDateTime } from '@/utils/format';
import type { StaffInvitation } from '@/types/staff';
import { roleBadgeClass, roleLabels } from '../lib/role';
import {
  useRevokeInvitation,
  useStaffInvitations,
} from '../hooks/useStaffInvitations';

interface Props {
  inviterLookup: Map<string, string>;
}

export function PendingInvitationsSection({ inviterLookup }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [revoking, setRevoking] = useState<StaffInvitation | undefined>();
  const listQuery = useStaffInvitations({ page: 1, limit: 50 });
  const revokeMutation = useRevokeInvitation();

  const invitations = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;

  const confirmRevoke = async () => {
    if (!revoking) return;
    const target = revoking;
    setRevoking(undefined);
    try {
      await revokeMutation.mutateAsync(target.id);
      toast.success(`Invitación a ${target.email} revocada`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo revocar';
      toast.error(message);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        {collapsed ? (
          <ChevronRight size={16} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={16} className="text-muted-foreground" />
        )}
        <Mail size={14} className="text-muted-foreground" />
        <span className="text-sm">
          Invitaciones pendientes
          {total > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({total})
            </span>
          )}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-border">
          {listQuery.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Cargando…</div>
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar las invitaciones.
              </p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              Sin invitaciones pendientes.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {invitations.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center gap-4 px-4 py-3 flex-wrap"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm">{inv.email}</span>
                      <span
                        className={cn(
                          'inline-flex items-center text-xs px-2 py-0.5 rounded',
                          roleBadgeClass[inv.role],
                        )}
                      >
                        {roleLabels[inv.role]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                      Invitado por{' '}
                      {inviterLookup.get(inv.invitedBy) ?? 'otro miembro'} ·
                      Expira {formatDateTime(inv.expiresAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRevoking(inv)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Revocar invitación a ${inv.email}`}
                    title="Revocar"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(revoking)}
        onClose={() => setRevoking(undefined)}
        onConfirm={() => void confirmRevoke()}
        title="Revocar invitación"
        message={
          revoking
            ? `¿Revocar la invitación a ${revoking.email}? El link que se le envió dejará de funcionar.`
            : ''
        }
        confirmLabel="Revocar"
      />
    </div>
  );
}
