import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Pagination } from '@/components/ui/Pagination';
import {
  CashRegistersFilters,
  CashRegistersTable,
  useCashRegisters,
} from '@/features/cash-registers';
import { daysAgoIso, todayIso } from '@/utils/date';
import type {
  CashRegister,
  CashRegisterStatus,
} from '@/types/cashRegisters';

const PAGE_SIZE = 20;
const DEFAULT_RANGE_DAYS = 30;

type StatusFilter = CashRegisterStatus | '';

export function CashRegistersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>('');
  const [dateFrom, setDateFrom] = useState(() =>
    daysAgoIso(DEFAULT_RANGE_DAYS),
  );
  const [dateTo, setDateTo] = useState(() => todayIso());

  const listQuery = useCashRegisters({
    page,
    limit: PAGE_SIZE,
    status: status === '' ? undefined : status,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const onStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };
  const onDateFromChange = (v: string) => {
    setDateFrom(v);
    setPage(1);
  };
  const onDateToChange = (v: string) => {
    setDateTo(v);
    setPage(1);
  };

  const handleSelect = (register: CashRegister) => {
    void navigate({
      to: '/cash-registers/$registerId',
      params: { registerId: register.id },
    });
  };

  const data = listQuery.data;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Cajas</h2>
          <p className="text-sm text-muted-foreground">
            Historial de cajas registradoras del POS. Consulta aperturas,
            cierres y arqueos.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <CashRegistersFilters
            status={status}
            onStatusChange={onStatusChange}
            dateFrom={dateFrom}
            onDateFromChange={onDateFromChange}
            dateTo={dateTo}
            onDateToChange={onDateToChange}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {listQuery.isLoading ? (
            <CashRegistersTableSkeleton />
          ) : listQuery.isError ? (
            <div className="p-6">
              <p className="text-sm text-destructive">
                No se pudieron cargar las cajas.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {listQuery.error instanceof Error
                  ? listQuery.error.message
                  : 'Error desconocido'}
              </p>
            </div>
          ) : data ? (
            <>
              <CashRegistersTable
                registers={data.items}
                onSelect={handleSelect}
              />
              {data.total > 0 && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  totalItems={data.total}
                  itemsPerPage={data.limit}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CashRegistersTableSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 px-4 flex items-center gap-4">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
