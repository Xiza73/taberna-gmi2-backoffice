import type { Paginated } from '@/types/api';
import type {
  ChangeStaffRoleInput,
  Staff,
  StaffListQuery,
  UpdateStaffInput,
} from '@/types/staff';
import { apiClient } from './client';

export const staffApi = {
  list(query: StaffListQuery = {}): Promise<Paginated<Staff>> {
    return apiClient.get<Paginated<Staff>>('/admin/staff', { query });
  },

  getById(id: string): Promise<Staff> {
    return apiClient.get<Staff>(`/admin/staff/${id}`);
  },

  update(id: string, input: UpdateStaffInput): Promise<Staff> {
    return apiClient.patch<Staff>(`/admin/staff/${id}`, input);
  },

  changeRole(id: string, input: ChangeStaffRoleInput): Promise<Staff> {
    return apiClient.patch<Staff>(`/admin/staff/${id}/role`, input);
  },

  suspend(id: string): Promise<void> {
    return apiClient.patch<void>(`/admin/staff/${id}/suspend`);
  },

  activate(id: string): Promise<void> {
    return apiClient.patch<void>(`/admin/staff/${id}/activate`);
  },
};
