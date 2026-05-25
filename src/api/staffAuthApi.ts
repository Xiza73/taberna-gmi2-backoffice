import type {
  AuthTokens,
  ChangePasswordInput,
  LoginInput,
  StaffMe,
  UpdateProfileInput,
} from '@/types/auth';
import type { RegisterStaffInput } from '@/types/staff';
import { apiClient } from './client';
import { clearTokens, setTokens } from './tokens';

export const staffAuthApi = {
  async login(input: LoginInput): Promise<AuthTokens> {
    const tokens = await apiClient.post<AuthTokens>('/staff/auth/login', input, {
      skipAuth: true,
      skipRefresh: true,
    });
    setTokens(tokens);
    return tokens;
  },

  // Registro público de staff. El back decide qué hacer:
  // - Si la DB no tiene staff aún: crea SUPER_ADMIN sin pedir token.
  // - Si ya hay staff: requiere `invitationToken` válido y el email
  //   debe coincidir con la invitación.
  async register(input: RegisterStaffInput): Promise<AuthTokens> {
    const tokens = await apiClient.post<AuthTokens>(
      '/staff/register',
      input,
      { skipAuth: true, skipRefresh: true },
    );
    setTokens(tokens);
    return tokens;
  },

  me(): Promise<StaffMe> {
    return apiClient.get<StaffMe>('/staff/auth/me');
  },

  updateProfile(input: UpdateProfileInput): Promise<StaffMe> {
    return apiClient.patch<StaffMe>('/staff/auth/profile', input);
  },

  changePassword(input: ChangePasswordInput): Promise<void> {
    return apiClient.patch<void>('/staff/auth/change-password', input);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<null>('/staff/auth/logout', undefined, { skipRefresh: true });
    } finally {
      clearTokens();
    }
  },
};
