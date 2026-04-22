import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffAuthApi } from '@/api/staffAuthApi';
import type { LoginInput, StaffMe, StaffRole } from '@/types/auth';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

interface UseAuthReturn {
  me: StaffMe | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: StaffRole | null;
  login: (input: LoginInput) => Promise<void>;
  isLoggingIn: boolean;
  loginError: Error | null;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function useAuth(): UseAuthReturn {
  const qc = useQueryClient();

  const meQuery = useQuery({
    queryKey: authKeys.me,
    queryFn: staffAuthApi.me,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: staffAuthApi.login,
    onSuccess: async () => {
      await qc.fetchQuery({ queryKey: authKeys.me, queryFn: staffAuthApi.me });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: staffAuthApi.logout,
    onSettled: () => {
      qc.clear();
    },
  });

  return {
    me: meQuery.data,
    isLoading: meQuery.isLoading,
    isAuthenticated: Boolean(meQuery.data),
    role: meQuery.data?.role ?? null,
    login: async (input) => {
      await loginMutation.mutateAsync(input);
    },
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    isLoggingOut: logoutMutation.isPending,
  };
}
