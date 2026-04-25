import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bannersApi } from '@/api/bannersApi';
import type {
  CreateBannerInput,
  UpdateBannerInput,
} from '@/types/banners';
import { bannerKeys } from './useBanners';

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBannerInput) => bannersApi.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
}

export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBannerInput }) =>
      bannersApi.update(id, input),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: bannerKeys.lists() });
      void qc.invalidateQueries({ queryKey: bannerKeys.detail(variables.id) });
    },
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bannersApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
}
