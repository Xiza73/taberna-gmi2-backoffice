export type StaffRole = 'super_admin' | 'admin' | 'user';

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  invitedBy: string | null;
  createdAt: string;
}

export interface StaffListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: StaffRole;
  isActive?: boolean;
}

export interface UpdateStaffInput {
  name?: string;
}

export interface ChangeStaffRoleInput {
  role: StaffRole;
}
