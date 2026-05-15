import { ChevronRight } from 'lucide-react';
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
import type { CashRegister } from '@/types/cashRegisters';
import { CashRegisterStatusBadge } from './CashRegisterStatusBadge';

interface Props {
  registers: CashRegister[];
  onSelect: (register: CashRegister) => void;
}

/** Umbral en centavos a partir del cual mostramos el chip de diferencia. */
const DIFFERENCE_HIGHLIGHT_CENTS = 1000;

function shortId(id: string): string {
  return id.slice(-8).toUpperCase();
}

function formatNullableCurrency(value: number | null): string {
  return value === null ? '—' : formatPEN(value);
}

function differenceChipClass(diff: number): string {
  if (diff === 0) return 'bg-muted text-muted-foreground';
  if (Math.abs(diff) > DIFFERENCE_HIGHLIGHT_CENTS) {
    return 'bg-amber-500/10 text-amber-400';
  }
  return 'bg-muted text-muted-foreground';
}

function formatSignedAmount(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${formatPEN(Math.abs(value))}`;
}

export function CashRegistersTable({ registers, onSelect }: Props) {
  if (registers.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No hay cajas para mostrar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Caja</TableHead>
          <TableHead>Apertura</TableHead>
          <TableHead>Cierre</TableHead>
          <TableHead>Staff</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Inicial</TableHead>
          <TableHead className="text-right">Esperado</TableHead>
          <TableHead className="text-right">Contado</TableHead>
          <TableHead className="text-right">Diferencia</TableHead>
          <TableHead className="w-[40px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registers.map((register) => {
          const diff = register.difference;
          return (
            <TableRow
              key={register.id}
              onClick={() => onSelect(register)}
              className="cursor-pointer"
            >
              <TableCell className="font-mono text-xs">
                {shortId(register.id)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground tabular-nums">
                {formatDateTime(register.openedAt)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground tabular-nums">
                {register.closedAt ? formatDateTime(register.closedAt) : '—'}
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {register.staffName ?? (
                    <span className="text-muted-foreground italic">
                      Sin nombre
                    </span>
                  )}
                </span>
              </TableCell>
              <TableCell>
                <CashRegisterStatusBadge status={register.status} />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPEN(register.initialAmount)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {formatNullableCurrency(register.expectedAmount)}
              </TableCell>
              <TableCell className="text-right tabular-nums font-medium">
                {formatNullableCurrency(register.closingAmount)}
              </TableCell>
              <TableCell className="text-right">
                {diff === null ? (
                  <span className="text-muted-foreground tabular-nums">—</span>
                ) : (
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-xs tabular-nums',
                      differenceChipClass(diff),
                    )}
                  >
                    {formatSignedAmount(diff)}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <ChevronRight
                  size={16}
                  className="text-muted-foreground inline"
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
