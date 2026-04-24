import {
  CircleSlash,
  CircleUserRound,
  Pencil,
  ShieldCheck,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/utils/cn';
import { formatDateTime } from '@/utils/format';
import type { Staff } from '@/types/staff';
import { roleBadgeClass, roleLabels } from '../lib/role';

interface Props {
  staff: Staff[];
  currentUserId: string;
  canChangeRole: boolean;
  onEdit: (staff: Staff) => void;
  onChangeRole: (staff: Staff) => void;
  onToggleActive: (staff: Staff) => void;
}

export function StaffTable({
  staff,
  currentUserId,
  canChangeRole,
  onEdit,
  onChangeRole,
  onToggleActive,
}: Props) {
  if (staff.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">No hay staff para mostrar.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Creado</TableHead>
          <TableHead className="text-right w-[140px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((member) => {
          const isSelf = member.id === currentUserId;
          return (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{member.name}</span>
                  {isSelf && (
                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      Vos
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {member.email}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center text-xs px-2 py-0.5 rounded',
                    roleBadgeClass[member.role],
                  )}
                >
                  {roleLabels[member.role]}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center text-xs px-2 py-0.5 rounded',
                    member.isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-destructive/10 text-destructive',
                  )}
                >
                  {member.isActive ? 'Activo' : 'Suspendido'}
                </span>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                {formatDateTime(member.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(member)}
                    className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Editar ${member.name}`}
                    title="Editar nombre"
                  >
                    <Pencil size={15} />
                  </button>
                  {canChangeRole && !isSelf && (
                    <button
                      type="button"
                      onClick={() => onChangeRole(member)}
                      className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Cambiar rol de ${member.name}`}
                      title="Cambiar rol"
                    >
                      <ShieldCheck size={15} />
                    </button>
                  )}
                  {!isSelf && (
                    <button
                      type="button"
                      onClick={() => onToggleActive(member)}
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        member.isActive
                          ? 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                          : 'hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400',
                      )}
                      aria-label={
                        member.isActive
                          ? `Suspender ${member.name}`
                          : `Activar ${member.name}`
                      }
                      title={member.isActive ? 'Suspender' : 'Activar'}
                    >
                      {member.isActive ? (
                        <CircleSlash size={15} />
                      ) : (
                        <CircleUserRound size={15} />
                      )}
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
