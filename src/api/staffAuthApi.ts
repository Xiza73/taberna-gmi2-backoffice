import type { AuthTokens, LoginInput, StaffMe } from '@/types/auth';
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

  me(): Promise<StaffMe> {
    return apiClient.get<StaffMe>('/staff/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<null>('/staff/auth/logout', undefined, { skipRefresh: true });
    } finally {
      clearTokens();
    }
  },
};
