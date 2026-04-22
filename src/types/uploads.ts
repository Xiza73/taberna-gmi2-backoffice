export type UploadFolder = 'products' | 'banners';

export interface UploadImageResponse {
  url: string;
  publicId: string;
}

export const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
