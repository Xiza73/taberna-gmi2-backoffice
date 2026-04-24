import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/api/staffApi';
import { authKeys } from '@/features/auth';
import type {
  ChangeStaffRoleInput,
  UpdateStaffInput,
} from '@/types/staff';
import { staffKeys } from './useStaff';

function invalidateStaff(
  qc: ReturnType<typeof useQueryClient>,
  id?: string,
) {
  void qc.invalidateQueries({ queryKey: staffKeys.lists() });
  if (id) {
    void qc.invalidateQueries({ queryKey: staffKeys.detail(id) });
  }
}

export function useUpdateStaff(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStaffInput) => staffApi.update(id, input),
    onSuccess: () => invalidateStaff(qc, id),
  });
}

export function useChangeStaffRole(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangeStaffRoleInput) => staffApi.changeRole(id, input),
    onSuccess: () => invalidateStaff(qc, id),
  });
}

export function useSuspendStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.suspend(id),
    onSuccess: (_data, id) => {
      invalidateStaff(qc, id);
      // If user suspended themselves (back rejects this, but defensive):
      void qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export function useActivateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.activate(id),
    onSuccess: (_data, id) => invalidateStaff(qc, id),
  });
}
