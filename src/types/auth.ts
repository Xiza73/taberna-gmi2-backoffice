export type StaffRole = 'super_admin' | 'admin' | 'user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface StaffMe {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  invitedBy: string | null;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
