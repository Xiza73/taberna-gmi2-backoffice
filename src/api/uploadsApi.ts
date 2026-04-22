import type { UploadFolder, UploadImageResponse } from '@/types/uploads';
import { apiClient } from './client';

export const uploadsApi = {
  uploadImage(file: File, folder: UploadFolder): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<UploadImageResponse>(
      '/admin/uploads/image',
      formData,
      { query: { folder } },
    );
  },

  deleteImage(publicId: string): Promise<void> {
    return apiClient.delete<void>(
      `/admin/uploads/image/${encodeURIComponent(publicId)}`,
    );
  },
};
