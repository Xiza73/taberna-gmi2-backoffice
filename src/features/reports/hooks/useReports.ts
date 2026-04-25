import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import type { SalesReportQuery } from '@/types/reports';

export const reportsKeys = {
  all: ['reports'] as const,
  sales: (query: SalesReportQuery) =>
    [...reportsKeys.all, 'sales', query] as const,
  topProducts: (limit: number) =>
    [...reportsKeys.all, 'top-products', limit] as const,
};

interface UseSalesReportOptions {
  enabled?: boolean;
}

export function useSalesReport(
  query: SalesReportQuery,
  options: UseSalesReportOptions = {},
) {
  return useQuery({
    queryKey: reportsKeys.sales(query),
    queryFn: () => adminApi.getSalesReport(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled: options.enabled ?? true,
  });
}

interface UseTopProductsOptions {
  enabled?: boolean;
}

export function useTopProducts(
  limit: number,
  options: UseTopProductsOptions = {},
) {
  return useQuery({
    queryKey: reportsKeys.topProducts(limit),
    queryFn: () => adminApi.getTopProducts(limit),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled: options.enabled ?? true,
  });
}
