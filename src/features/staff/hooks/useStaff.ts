import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { staffApi } from '@/api/staffApi';
import type { StaffListQuery } from '@/types/staff';

export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (query: StaffListQuery) => [...staffKeys.lists(), query] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
};

export function useStaffList(query: StaffListQuery = {}) {
  return useQuery({
    queryKey: staffKeys.list(query),
    queryFn: () => staffApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
