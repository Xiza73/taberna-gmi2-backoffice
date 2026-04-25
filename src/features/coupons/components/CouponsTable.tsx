import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/utils/cn';
import { formatDate, formatInteger, formatPEN } from '@/utils/format';
import type { Coupon, CouponType } from '@/types/coupons';
import { couponTypeBadgeClass, couponTypeLabels } from '../lib/couponType';

interface Props {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

function formatValue(type: CouponType, value: number): string {
  if (type === 'percentage') return `${value}%`;
  return formatPEN(value);
}

function isExpired(coupon: Coupon): boolean {
  return new Date(coupon.endDate) < new Date();
}

export function CouponsTable({ coupons, onEdit, onDelete }: Props) {
  if (coupons.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No hay cupones para mostrar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Descuento</TableHead>
          <TableHead className="text-right">Usos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Vigencia</TableHead>
          <TableHead className="text-right w-[120px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons.map((coupon) => {
          const expired = isExpired(coupon);
          const usesText = coupon.maxUses
            ? `${formatInteger(coupon.currentUses)} / ${formatInteger(coupon.maxUses)}`
            : `${formatInteger(coupon.currentUses)} / ∞`;

          return (
            <TableRow key={coupon.id}>
              <TableCell className="font-mono text-xs uppercase">
                {coupon.code}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center text-xs px-2 py-0.5 rounded',
                    couponTypeBadgeClass[coupon.type],
                  )}
                >
                  {couponTypeLabels[coupon.type]}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums font-medium">
                {formatValue(coupon.type, coupon.value)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-sm">
                {usesText}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center text-xs px-2 py-0.5 rounded',
                    !coupon.isActive
                      ? 'bg-muted text-muted-foreground'
                      : expired
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-emerald-500/10 text-emerald-400',
                  )}
                >
                  {!coupon.isActive ? 'Inactivo' : expired ? 'Expirado' : 'Activo'}
                </span>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                {formatDate(coupon.startDate)} → {formatDate(coupon.endDate)}
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(coupon)}
                    className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Editar ${coupon.code}`}
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(coupon)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Eliminar ${coupon.code}`}
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
