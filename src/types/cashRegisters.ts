export type CashRegisterStatus = 'open' | 'closed';

export type CashMovementType = 'cash_in' | 'cash_out';

export interface CashMovement {
  id: string;
  cashRegisterId: string;
  staffId: string;
  type: CashMovementType;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface CashRegister {
  id: string;
  staffId: string;
  /**
   * Nombre del staff resuelto por el back. Puede ser null si no se pudo
   * resolver (staff eliminado o no encontrado en findByIds).
   */
  staffName: string | null;
  openedAt: string;
  closedAt: string | null;
  /** Monto inicial al abrir caja (centavos PEN). */
  initialAmount: number;
  /** Monto contado al cerrar (centavos). Null mientras la caja esté abierta. */
  closingAmount: number | null;
  /** Esperado calculado por el back: initial + cashSales + cashIn - cashOut. */
  expectedAmount: number | null;
  /** closingAmount - expectedAmount. Positivo = sobrante, negativo = faltante. */
  difference: number | null;
  status: CashRegisterStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  /** Ventas en efectivo registradas mientras la caja estuvo abierta. */
  cashSalesAmount: number;
  cashInAmount: number;
  cashOutAmount: number;
  /** Sólo presente en GET /:id. */
  movements?: CashMovement[];
}

export interface CashRegisterListQuery {
  page?: number;
  limit?: number;
  staffId?: string;
  status?: CashRegisterStatus;
  /** ISO date YYYY-MM-DD inclusive. */
  dateFrom?: string;
  /** ISO date YYYY-MM-DD inclusive. */
  dateTo?: string;
}
