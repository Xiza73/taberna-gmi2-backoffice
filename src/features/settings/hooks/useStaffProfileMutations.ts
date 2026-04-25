import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffAuthApi } from '@/api/staffAuthApi';
import { authKeys } from '@/features/auth';
import type { ChangePasswordInput, UpdateProfileInput } from '@/types/auth';

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => staffAuthApi.updateProfile(input),
    onSuccess: (data) => {
      // Update the cached me directly + invalidate to keep things in sync
      qc.setQueryData(authKeys.me, data);
      void qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => staffAuthApi.changePassword(input),
    // After change-password, the back revokes all refresh tokens.
    // Caller (the form) is responsible for clearing tokens + redirecting.
  });
}
