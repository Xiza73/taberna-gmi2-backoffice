import { ChevronRight, CircleSlash, CircleUserRound } from 'lucide-react';
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
import type { Customer } from '@/types/customers';

interface Props {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  onToggleActive: (customer: Customer) => void;
}

export function CustomersTable({ customers, onSelect, onToggleActive }: Props) {
  if (customers.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">No hay clientes para mostrar.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Registrado</TableHead>
          <TableHead className="text-right w-[80px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow
            key={customer.id}
            onClick={() => onSelect(customer)}
            className="cursor-pointer"
          >
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {customer.email}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground tabular-nums">
              {customer.phone ?? '—'}
            </TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
              {formatDateTime(customer.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="inline-flex gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(customer);
                  }}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    customer.isActive
                      ? 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                      : 'hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400',
                  )}
                  aria-label={
                    customer.isActive
                      ? `Suspender ${customer.name}`
                      : `Activar ${customer.name}`
                  }
                  title={customer.isActive ? 'Suspender' : 'Activar'}
                >
                  {customer.isActive ? (
                    <CircleSlash size={15} />
                  ) : (
                    <CircleUserRound size={15} />
                  )}
                </button>
                <ChevronRight size={16} className="text-muted-foreground my-auto" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
