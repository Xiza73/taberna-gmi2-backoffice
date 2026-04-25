import type { DashboardSummary } from '@/types/dashboard';
import type {
  SalesReport,
  SalesReportQuery,
  TopProduct,
} from '@/types/reports';
import { apiClient } from './client';

export const adminApi = {
  getDashboardSummary(): Promise<DashboardSummary> {
    return apiClient.get<DashboardSummary>('/admin/dashboard');
  },
  getSalesReport(query: SalesReportQuery): Promise<SalesReport> {
    return apiClient.get<SalesReport>('/admin/dashboard/sales', { query });
  },
  getTopProducts(limit: number): Promise<TopProduct[]> {
    return apiClient.get<TopProduct[]>('/admin/dashboard/top-products', {
      query: { limit },
    });
  },
};
