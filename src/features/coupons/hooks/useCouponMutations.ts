import { useMutation, useQueryClient } from '@tanstack/react-query';
import { couponsApi } from '@/api/couponsApi';
import type {
  CreateCouponInput,
  UpdateCouponInput,
} from '@/types/coupons';
import { couponKeys } from './useCoupons';

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCouponInput) => couponsApi.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCouponInput }) =>
      couponsApi.update(id, input),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: couponKeys.lists() });
      void qc.invalidateQueries({ queryKey: couponKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
}
