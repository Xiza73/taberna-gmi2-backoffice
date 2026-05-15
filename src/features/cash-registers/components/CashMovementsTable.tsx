import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/utils/cn';
import { formatDateTime, formatPEN } from '@/utils/format';
import type { CashMovement } from '@/types/cashRegisters';
import {
  cashMovementSign,
  cashMovementTypeLabels,
} from '../lib/cashMovementType';

interface Props {
  movements: CashMovement[];
}

export function CashMovementsTable({ movements }: Props) {
  if (movements.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 lg:p-5">
        <h3 className="text-sm text-muted-foreground mb-2">Movimientos</h3>
        <p className="text-sm text-muted-foreground">
          No se registraron movimientos en esta caja.
        </p>
      </div>
    );
  }

  const ordered = [...movements].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 lg:px-5 pt-4 lg:pt-5 pb-2">
        <h3 className="text-sm text-muted-foreground">
          Movimientos ({movements.length})
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hora</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead className="text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordered.map((movement) => {
            const sign = cashMovementSign[movement.type];
            const isIn = movement.type === 'cash_in';
            return (
              <TableRow key={movement.id}>
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {formatDateTime(movement.createdAt)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    {isIn ? (
                      <ArrowDownLeft
                        size={14}
                        className="text-emerald-400"
                      />
                    ) : (
                      <ArrowUpRight
                        size={14}
                        className="text-destructive"
                      />
                    )}
                    {cashMovementTypeLabels[movement.type]}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  <p className="max-w-[420px] truncate" title={movement.reason}>
                    {movement.reason}
                  </p>
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right tabular-nums font-medium',
                    isIn ? 'text-emerald-400' : 'text-destructive',
                  )}
                >
                  {sign > 0 ? '+' : '-'}
                  {formatPEN(movement.amount)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
