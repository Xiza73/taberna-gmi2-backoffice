import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/settingsApi';
import type { UpdateStoreSettingsInput } from '@/types/settings';

export const storeSettingsKeys = {
  all: ['storeSettings'] as const,
} as const;

export function useStoreSettings() {
  return useQuery({
    queryKey: storeSettingsKeys.all,
    queryFn: settingsApi.get,
    staleTime: 60_000,
  });
}

export function useUpdateStoreSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStoreSettingsInput) => settingsApi.update(input),
    onSuccess: (data) => {
      qc.setQueryData(storeSettingsKeys.all, data);
    },
  });
}
