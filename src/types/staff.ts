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

export interface StaffInvitation {
  id: string;
  email: string;
  role: StaffRole;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export interface StaffInvitationListQuery {
  page?: number;
  limit?: number;
}

export interface InviteStaffInput {
  email: string;
  role: StaffRole;
}

export interface ValidateInvitationResponse {
  email: string;
  role: StaffRole;
  invitedByName: string;
}

export interface AcceptInvitationInput {
  name: string;
  password: string;
}
