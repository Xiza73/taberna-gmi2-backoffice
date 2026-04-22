import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: adminApi.getDashboardSummary,
    staleTime: 60_000,
  });
}
