import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { staffAuthApi } from '@/api/staffAuthApi';
import { staffInvitationsApi } from '@/api/staffInvitationsApi';
import type {
  AcceptInvitationInput,
  InviteStaffInput,
  RegisterStaffInput,
  StaffInvitationListQuery,
} from '@/types/staff';

export const staffInvitationKeys = {
  all: ['staff-invitations'] as const,
  lists: () => [...staffInvitationKeys.all, 'list'] as const,
  list: (query: StaffInvitationListQuery) =>
    [...staffInvitationKeys.lists(), query] as const,
  validate: (token: string) =>
    [...staffInvitationKeys.all, 'validate', token] as const,
};

export function useStaffInvitations(query: StaffInvitationListQuery = {}) {
  return useQuery({
    queryKey: staffInvitationKeys.list(query),
    queryFn: () => staffInvitationsApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useInviteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteStaffInput) => staffInvitationsApi.invite(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffInvitationKeys.lists() });
    },
  });
}

export function useRevokeInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffInvitationsApi.revoke(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffInvitationKeys.lists() });
    },
  });
}

export function useValidateInvitation(token: string | undefined) {
  return useQuery({
    queryKey: staffInvitationKeys.validate(token ?? ''),
    queryFn: () => staffInvitationsApi.validate(token as string),
    enabled: Boolean(token),
    retry: false,
    staleTime: 60_000,
  });
}

export function useAcceptInvitation(token: string) {
  return useMutation({
    mutationFn: (input: AcceptInvitationInput) =>
      staffInvitationsApi.accept(token, input),
  });
}

export function useRegisterStaff() {
  return useMutation({
    mutationFn: (input: RegisterStaffInput) => staffAuthApi.register(input),
  });
}
