import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { posReportsApi } from '@/api/posReportsApi';

export const dailyPosReportKeys = {
  all: ['posReports', 'daily'] as const,
  byDate: (date: string) => ['posReports', 'daily', date] as const,
};

/**
 * Reporte diario de ventas POS. `keepPreviousData` evita el "flash" de
 * skeleton al cambiar la fecha — se mantiene el último set hasta que la
 * nueva fecha resuelve.
 */
export function useDailyPosReport(date: string) {
  return useQuery({
    queryKey: dailyPosReportKeys.byDate(date),
    queryFn: () => posReportsApi.daily({ date }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
