export type BannerPosition = 'hero' | 'secondary' | 'footer';

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  position: BannerPosition;
  isActive: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BannerListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  position?: BannerPosition;
}

export interface CreateBannerInput {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  position: BannerPosition;
  isActive?: boolean;
  sortOrder?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateBannerInput {
  title?: string;
  imageUrl?: string;
  linkUrl?: string | null;
  position?: BannerPosition;
  isActive?: boolean;
  sortOrder?: number;
  startDate?: string | null;
  endDate?: string | null;
}
