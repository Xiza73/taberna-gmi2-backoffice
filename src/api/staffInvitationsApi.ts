import type { Paginated } from '@/types/api';
import type { AuthTokens } from '@/types/auth';
import type {
  AcceptInvitationInput,
  InviteStaffInput,
  StaffInvitation,
  StaffInvitationListQuery,
  ValidateInvitationResponse,
} from '@/types/staff';
import { apiClient } from './client';

export const staffInvitationsApi = {
  // Admin endpoints
  list(query: StaffInvitationListQuery = {}): Promise<Paginated<StaffInvitation>> {
    return apiClient.get<Paginated<StaffInvitation>>(
      '/admin/staff/invitations',
      { query },
    );
  },

  invite(input: InviteStaffInput): Promise<StaffInvitation> {
    return apiClient.post<StaffInvitation>('/admin/staff/invitations', input);
  },

  revoke(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/staff/invitations/${id}`);
  },

  // Public endpoints (no auth)
  validate(token: string): Promise<ValidateInvitationResponse> {
    return apiClient.get<ValidateInvitationResponse>(
      `/staff/invitations/${encodeURIComponent(token)}/validate`,
      { skipAuth: true, skipRefresh: true },
    );
  },

  accept(token: string, input: AcceptInvitationInput): Promise<AuthTokens> {
    return apiClient.post<AuthTokens>(
      `/staff/invitations/${encodeURIComponent(token)}/accept`,
      input,
      { skipAuth: true, skipRefresh: true },
    );
  },
};
