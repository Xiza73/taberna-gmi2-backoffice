import { useMutation } from '@tanstack/react-query';
import { uploadsApi } from '@/api/uploadsApi';
import type { UploadFolder } from '@/types/uploads';

export function useUploadImage() {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder: UploadFolder }) =>
      uploadsApi.uploadImage(file, folder),
  });
}

export function useDeleteImage() {
  return useMutation({
    mutationFn: (publicId: string) => uploadsApi.deleteImage(publicId),
  });
}
