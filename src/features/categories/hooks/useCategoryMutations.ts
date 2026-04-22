import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categoriesApi';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/categories';
import { categoryKeys } from './useCategories';

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoriesApi.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoriesApi.update(id, input),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: categoryKeys.lists() });
      void qc.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}
