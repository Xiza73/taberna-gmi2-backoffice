import type { DashboardSummary } from '@/types/dashboard';
import { apiClient } from './client';

export const adminApi = {
  getDashboardSummary(): Promise<DashboardSummary> {
    return apiClient.get<DashboardSummary>('/admin/dashboard');
  },
};
